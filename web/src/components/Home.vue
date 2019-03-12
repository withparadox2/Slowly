<template>
  <div>
    <div id="account-loading"
         v-loading="loadingAccount"
         element-loading-text="加载个人信息...">
    </div>
    <div class="friends section">
      <div v-for="friend in friendList"
           class="friend-item"
           :class="{checked: friend == checkedFriend}"
           @click="clickFriend(friend)"
           :key="friend.user_id">
        {{friend.name}}
      </div>
    </div>
    <div class="letters section">
      <div v-for="letter in letterList"
           class="letter-item"
           :key="letter.id">
        <div>

        </div>
        <div>
          {{letter.body}}
        </div>
      </div>
    </div>
    <div class="map-container"
         v-if="mapVisible">
      <div id="map"></div>
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
.letters {
  position: absolute;
  left: 200px;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}
.letter-item {
  padding-bottom: 20px;
  font-size: 14px;
  white-space: pre-wrap;
  padding-bottom: 20px;
  font-size: 15px;
  white-space: pre-line;
  line-height: 25px;
}
.map-container {
  z-index: 999;
  position: fixed;
  top: 10%;
  bottom: 10%;
  right: 10%;
  left: 10%;
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
import { friendListData } from "./friends-data"
import { insertFriends } from "../persist/friend-store"
import { getToken, getAccount } from "../persist/account"

export default {
  data() {
    return {
      friendList: [],
      checkedFriend: null,
      letterList: [],
      mapVisible: false,
      map: null,
      loadingAccount: true
    }
  },
  methods: {
    clickFriend(friend) {
      this.checkedFriend = friend
      // this.loadLetters(friend)
      this.showMap(friend)
    },
    loadLetters(friend) {
      getLetters(friend.id, 1)
        .then(response => {
          this.letterList = response.data.comments.data
        })
        .catch(({ message }) => showError(this, message))
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
      this.friendList = friendListData
      this.checkedFriend = this.friendList[0]
      insertFriends(this.friendList)
      // getFriends()
      //   .then(response => {
      //     this.friendList = (response.data && response.data.friends) || []
      //   })
      //   .catch(({ message }) => showError(this, message))
    }
  },
  mounted() {
    if (!getToken()) {
      this.$router.replace({
        name: "login"
      })
      return
    }

    if (!getAccount()) {
      loadAccount()
        .then(response => {
        })
        .catch(this.$errorHandler())
    }
  }
}
</script>
