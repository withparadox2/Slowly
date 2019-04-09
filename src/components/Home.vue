<template>
  <div>
    <div id="account-loading"
         v-if="!accountInfo"
         v-loading="!accountInfo"
         element-loading-text="加载个人信息...">
    </div>
    <div class="nav-header">
      <span class="title">Slowly</span>
      <el-dropdown class="menu-more"
                   trigger="click">
        <i class="el-icon-more"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="editLocation">修改位置</el-dropdown-item>
          <el-dropdown-item @click.native="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="main-content">
      <div class="left-section">
        <friends />
      </div>
      <div class="right-section">
        <letters v-on:showMap="showMap($event)"
                 v-show="checkedFriend" />
        <div v-show="!checkedFriend"
             class="quote-section">
          <div class="content">{{quote.content}}</div>
          <div class="author">{{quoteAuthor}}</div>
        </div>
      </div>
      <div class="new-version"
           @click="updateNewVersion()"
           v-show="newVersion">
        检测到新版本，点击刷新
      </div>
    </div>
    <map-node ref="map" />
  </div>
</template>
<style scoped>
.nav-header {
  background-color: #0078d7;
  height: 48px;
  color: white;
}
.nav-header .title {
  font-size: 18px;
  line-height: 48px;
  margin-left: 20px;
}
.nav-header .btn-exit {
  font-size: 14px;
  line-height: 48px;
  float: right;
  padding: 0 20px;
  cursor: pointer;
}
.nav-header .btn-exit:hover {
  background-color: #005a9e;
}
.nav-header .menu-more {
  float: right;
  cursor: pointer;
}
.nav-header .el-icon-more {
  color: white;
  line-height: 48px;
  padding: 0 20px;
}
.nav-header .el-icon-more:hover {
  background-color: #005a9e;
}
.main-content {
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  bottom: 0;
}
.left-section {
  background: #f4f4f4;
  position: absolute;
  left: 0;
  width: 200px;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}
.right-section {
  position: absolute;
  left: 200px;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-x: hidden;
}
.quote-section {
  max-width: 70%;
  margin: 0 auto;
  min-width: 300px;
  top: 30%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  position: absolute;
}
.quote-section .content {
  font-size: 20px;
  color: #555;
  line-height: 30px;
  white-space: pre-wrap;
}
.quote-section .author {
  margin-top: 10px;
  font-size: 14px;
  text-align: right;
  color: #777;
}
.new-version {
  position: absolute;
  right: 30px;
  bottom: 30px;
  font-size: 13px;
  color: white;
  border-radius: 5px;
  white-space: nowrap;
  background: #0078d7;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
  padding: 5px 10px;
  cursor: pointer;
}
#account-loading {
  z-index: 1000;
  position: fixed;
  width: 100%;
  height: 100%;
  background: white;
}
</style>
<script>
import { mapState, mapMutations } from "vuex"
import * as api from "../api"
import { showError, showSuccess } from "../util"
import * as friendStore from "../persist/friend-store"
import * as account from "../persist/account"
import { getDataManager } from "../persist/letter-store"
import { sortFriends } from "../helper"
import { checkVersion, updateVersion } from "../update"
import { quotes } from "../quote"
import Friends from "./Friends.vue"
import Letters from "./Letters.vue"
import Map from "./Map.vue"

export default {
  data() {
    return {
      accountInfo: null,
      newVersion: false
    }
  },
  components: {
    Friends,
    Letters,
    "map-node": Map
  },
  computed: {
    ...mapState(["checkedFriend", "friendList"]),
    quote() {
      return quotes[parseInt(Math.random() * quotes.length)]
    },
    quoteAuthor() {
      let first = this.quote.ref_name || this.quote.au_name
      let second = this.quote.ref_name ? this.quote.au_name : ""
      return first ? `——${first}${second ? " · " : ""}${second}` : ""
    }
  },
  methods: {
    ...mapMutations(["setFriends"]),
    exit() {
      //TODO check draft
      this.$confirm("退出后数据仍在，是否确定退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          account.clear()
          this.goLogin()
        })
        .catch(() => {})
    },
    goLogin() {
      this.$router.replace({
        name: "login"
      })
    },
    showMap(friend) {
      this.$refs.map.showMap(friend)
    },
    loadFriends() {
      let loadFromServer = () => {
        api
          .getFriends()
          .then(({ data }) => {
            this.setFriends(sortFriends(data.friends))
            friendStore.insertFriends(this.friendList)
          })
          .catch(this.$errorHandler())
      }
      friendStore
        .getFriends()
        .then((list = []) => {
          this.setFriends(sortFriends(list))
          if (list.length == 0 || !__CONFIG__.useCache) {
            loadFromServer()
          }
        })
        .catch(() => {
          loadFromServer()
        })
    },
    editLocation() {
      this.$refs.map.editLocation()
    },
    updateNewVersion() {
      updateVersion()
    }
  },
  mounted() {
    if (!account.getToken()) {
      this.goLogin()
      return
    }

    this.accountInfo = account.getAccount()
    if (!this.accountInfo) {
      api
        .getMe()
        .then(response => {
          this.accountInfo = response.data
          account.setAccount(this.accountInfo)
          this.loadFriends()
        })
        .catch(this.$errorHandler())
    } else {
      this.loadFriends()
      api.getMe().then(response => {
        account.setAccount(response.data)
      })
    }

    checkVersion().then(newVersion => {
      this.newVersion = newVersion
    })
  }
}
</script>
