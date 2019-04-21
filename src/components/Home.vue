<template>
  <div>
    <div id="account-loading"
         v-if="!accountInfo"
         v-loading="!accountInfo"
         element-loading-text="加载个人信息...">
    </div>
    <div class="nav-header">
      <img class="logo"
           src="../../images/ic_logo.svg" />
      <span class="title">Slowly</span>
      <div class="middle">
        <input-box v-if="checkedFriend"></input-box>
      </div>
      <el-dropdown class="menu-more"
                   trigger="click">
        <i class="el-icon-more"></i>`
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
        <quote-node v-show="!checkedFriend"></quote-node>
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
<style lang="stylus" scoped>
@require ('../var.styl')
.nav-header
  background-color $main-color
  height 48px
  color white
  display flex
  .logo
    margin-left 10px
    width 25px
  .title
    font-size 18px
    line-height 48px
    margin-left 10px
  .middle
    flex 1
    display flex
    align-items center
    justify-content center
    flex-direction row
  .btn-exit
    font-size 14px
    line-height 48px
    float right
    padding 0 20px
    cursor pointer
  .btn-exit:hover
    background-color $main-color-dark
  .menu-more
    cursor pointer
  .el-icon-more
    color white
    line-height 48px
    padding 0 20px
    display block
  .el-icon-more:hover
    background-color $main-color-dark
.main-content
  position absolute
  top 48px
  left 0
  right 0
  bottom 0
.left-section
  background #f4f4f4
  position absolute
  left 0
  width 200px
  top 0
  bottom 0
  overflow-y auto
.right-section
  position absolute
  left 200px
  right 0
  top 0
  bottom 0
  overflow-x hidden
.new-version
  position absolute
  right 30px
  bottom 30px
  font-size 13px
  color white
  border-radius 5px
  white-space nowrap
  background $main-color
  box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.4)
  padding 5px 10px
  cursor pointer
#account-loading
  z-index 1000
  position fixed
  width 100%
  height 100%
  background white
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
import Friends from "./Friends.vue"
import Letters from "./Letters.vue"
import Map from "./Map.vue"
import InputBox from "./InputBox.vue"
import Quote from "./Quote.vue"

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
    "map-node": Map,
    InputBox,
    "quote-node": Quote
  },
  computed: {
    ...mapState(["checkedFriend", "friendList"])
  },
  methods: {
    ...mapMutations(["setFriends"]),
    exit() {
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
