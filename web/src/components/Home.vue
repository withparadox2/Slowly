<template>
  <div>
    <div id="account-loading"
         v-if="!accountInfo"
         v-loading="!accountInfo"
         element-loading-text="加载个人信息...">
    </div>
    <div class="friends section">
      <div v-for="friend in orderedFriendList"
           class="friend-item"
           :class="{checked: friend == checkedFriend}"
           @click="clickFriend(friend)"
           :key="friend.user_id">
        {{friend.name}}
        <span class="btn-map"
              @click.stop="showMap(friend)">地图</span>
      </div>
    </div>
    <el-row class="right-section">
      <el-col :span="editorVisible ? 12 : 24"
              class="letters-section">
        <button @click="newLetter">新增</button>
        <div v-show="letterState">{{letterState}}</div>
        <div v-for="letter in letterList"
             class="letter-item"
             :key="letter.id">
          <div>
            {{letter.body}}
          </div>
        </div>
      </el-col>
      <el-col :span="12"
              v-show="editorVisible"
              class="editor-section">
      </el-col>
    </el-row>
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
.friends {
  background: #f4f4f4;
  position: absolute;
  left: 0;
  width: 200px;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}
.friend-item {
  cursor: pointer;
  padding: 10px;
  color: #34373d;
  font-size: 14px;
}
.friend-item.checked {
  background-color: #ededed;
}
.friend-item:hover {
  background-color: #f5f5f5;
  background: #fafafa;
}
.friend-item .btn-map {
  float: right;
  font-size: 12px;
  background: #ddffaa;
  padding: 2px 5px;
  border-radius: 3px;
}
.right-section {
  position: absolute;
  left: 200px;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-x: hidden;
}
.letters-section {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  height: 100%;
}
.editor-section {
  overflow-y: auto;
  height: 100%;
}
.letter-item {
  padding-bottom: 20px;
  font-size: 14px;
  white-space: pre-wrap;
  padding-bottom: 20px;
  font-size: 15px;
  white-space: pre-line;
  line-height: 25px;
  max-width: 600px;
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
import { getFriends, getLetters, getMe as loadAccount } from "../api"
import { showError } from "../util"
import * as friendStore from "../persist/friend-store"
import { getToken, getAccount, setAccount } from "../persist/account"
import { getDataManager } from "../persist/letter-store"

export default {
  data() {
    return {
      friendList: [],
      checkedFriend: null,
      letterList: [],
      mapVisible: false,
      map: null,
      accountInfo: null,
      letterState: "",
      editorVisible: false
    }
  },
  computed: {
    orderedFriendList() {
      return (this.friendList || []).sort(
        (first, second) =>
          -first.latest_comment.localeCompare(second.latest_comment)
      )
    }
  },
  methods: {
    clickFriend(friend) {
      this.checkedFriend = friend
      this.letterPage = 0
      this.infiniteId++
      this.letterList = []
      getDataManager(friend.id)
        .setCallback((mgr, { isRefresh, isSync, dataList, isSuccess }) => {
          if (mgr.userId == this.checkedFriend.id) {
            if (isSync) {
              this.letterState = `正在同步${mgr.syncPage}页`
            } else if (isRefresh) {
              this.letterState = `正在刷新`
            } else {
              this.letterState = isSuccess ? "" : "同步失败"
            }
            this.letterList = dataList
          }
        })
        .requestData()
      // this.showMap(friend)
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
        getFriends()
          .then(response => {
            this.friendList = (response.data && response.data.friends) || []
            friendStore.insertFriends(this.friendList)
          })
          .catch(this.$errorHandler())
      }
      friendStore
        .getFriends()
        .then((list = []) => {
          this.friendList = list || []
          if (list.length == 0 || !__CONFIG__.useCache) {
            loadFromServer()
          }
        })
        .catch(() => {
          loadFromServer()
        })
    },
    initPage() {
      this.loadFriends()
    },
    newLetter() {
      this.editorVisible = !this.editorVisible
    }
  },
  mounted() {
    if (!getToken()) {
      this.$router.replace({
        name: "login"
      })
      return
    }

    this.accountInfo = getAccount()
    if (!this.accountInfo) {
      loadAccount()
        .then(response => {
          this.accountInfo = response.data
          setAccount(this.accountInfo)
          this.initPage()
        })
        .catch(this.$errorHandler())
    } else {
      this.initPage()
    }
  }
}
</script>
