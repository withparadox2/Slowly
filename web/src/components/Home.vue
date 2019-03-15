<template>
  <div>
    <div id="account-loading"
         v-if="!accountInfo"
         v-loading="!accountInfo"
         element-loading-text="加载个人信息...">
    </div>
    <div class="nav-header">
      <span class="title">Slowly</span>
      <span class="btn-exit"
            @click="exit">退出</span>
    </div>
    <div class="main-content">
      <div class="left-section">
        <friends />
      </div>
      <div class="right-section">
        <letters />
      </div>
    </div>
    <div class="map-container"
         v-show="mapVisible">
      <div class="map-wrapper">
        <div id="map"></div>
      </div>
      <div class="btn-close-map"
           @click="mapVisible = false">关闭</div>
    </div>
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

.map-container {
  z-index: 999;
  position: fixed;
  background: #000000aa;
  width: 100%;
  height: 100%;
}
.map-wrapper {
  position: absolute;
  top: 10%;
  bottom: 10%;
  right: 10%;
  left: 10%;
}
.btn-close-map {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 40px;
  height: 30px;
  margin-right: -55px;
  white-space: nowrap;
  color: white;
  cursor: pointer;
  text-align: right;
}
#map {
  width: 100%;
  height: 100%;
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
import Friends from "./Friends.vue"
import Letters from "./Letters.vue"

export default {
  data() {
    return {
      mapVisible: false,
      map: null,
      accountInfo: null,
    }
  },
  components: {
    Friends,
    Letters
  },
  computed: {
    ...mapState(["checkedFriend", "friendList"])
  },
  methods: {
    ...mapMutations(["setFriends"]),
    exit() {
      //TODO check draft
      this.$confirm("是否确定退出?", "提示", {
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
      this.mapVisible = true
      this.$nextTick(() => {
        if (!this.map) {
          this.map = new BMap.Map("map")
          this.map.enableScrollWheelZoom(true)
        }
        let locations = friend.user_location.split(",")
        let point = new BMap.Point(
          parseFloat(locations[1]),
          parseFloat(locations[0])
        )
        this.transPoint(point)
      })
    },
    transPoint(point) {
      new BMap.Convertor().translate([point], 1, 5, data => {
        if (data.status === 0) {
          this.map.addOverlay(new BMap.Marker(data.points[0]))
          // this.map.setCenter(data.points[0])
          this.map.centerAndZoom(data.points[0], 15)
        }
      })
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
    }
  }
}
</script>
