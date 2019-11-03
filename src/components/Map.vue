<template>
  <div class="modal"
       v-show="mapVisible">
    <div class="map-wrapper">
      <div id="map"></div>
    </div>
    <el-button type="primary"
               icon="el-icon-close"
               circle
               class="btn-close"
               title="关闭地图"
               @click="mapVisible = false"></el-button>

    <el-button type="primary"
               icon="el-icon-edit"
               class="btn-update-location"
               @click="updateToSelectLocation"
               title="更新为选中的位置"
               circle></el-button>

    <el-button type="primary"
               v-if="false"
               icon="el-icon-location-outline"
               class="btn-locate"
               @click="locate"
               title="定位当前位置"
               circle></el-button>
  </div>
</template>
<style lang="stylus" scoped>
.map-wrapper
  position absolute
  top 10%
  bottom 10%
  right 10%
  left 10%
  #map
    width 100%
    height 100%
    border-radius 10px
.btn-close
  position absolute
  top 10%
  right 10%
  margin-right -55px
  cursor pointer
.btn-update-location
  position absolute
  top 10%
  right 10%
  margin-right -55px
  margin-top 60px
  cursor pointer
.btn-locate
  position absolute
  top 10%
  right 10%
  margin-right -55px
  margin-top 120px
  cursor pointer
</style>
<style lang="stylus">
.mobile-mode
  .btn-close, .btn-update-location
    margin-right 10px
  .btn-close
    margin-top 10px
  .btn-update-location
    margin-top 70px    
</style>

<script>
import * as account from "../persist/account"
import { showError, showSuccess } from "../util"
import { wgs2bd, bd2wgs } from "../coord-util"
import { updateLocation } from "../api"
import { mapState } from "vuex"
export default {
  data() {
    return {
      map: null,
      mapVisible: false
    }
  },
  methods: {
    editLocation() {
      if (account.getAccount()) {
        if (!account.getAccount().location) {
          showError(this, "当前账户坐标信息不存在")
          this.showGpsLocation(0, 0)
        } else {
          this.showGpsLocationStr(account.getAccount().location)
        }
      } else {
        showError(this, "账户不存在")
      }
    },
    onMapClick(e) {
      console.log(e.point)
      this.removeOverlays()
      this.addMarker(e.point, false)
    },
    showMap(friend) {
      this.showGpsLocationStr(friend.user_location)
    },
    showGpsLocationStr(location) {
      let locations = location.split(",")
      this.showGpsLocation(parseFloat(locations[0]), parseFloat(locations[1]))
    },
    showGpsLocation(lat, lng) {
      this.initMap().then(() => {
        this.removeOverlays()
        let latlng = wgs2bd(lat, lng)
        this.addMarker(new BMap.Point(latlng[1], latlng[0]), true)
      })
    },
    initMap() {
      this.mapVisible = true
      return new Promise(fullfill => {
        this.$nextTick(() => {
          if (!this.map) {
            this.map = new BMap.Map("map")
            this.map.enableScrollWheelZoom(true)
            this.map.addEventListener("click", e => {
              this.onMapClick(e)
            })
          }
          fullfill(this.map)
        })
      })
    },
    addMarker(point, zoom) {
      let marker = new BMap.Marker(point)
      marker.slowly = true
      this.map.addOverlay(marker)
      if (zoom) {
        this.map.centerAndZoom(point, 15)
        window.setTimeout(() => {
          this.map.panTo(point)
        }, 100)
      }
    },
    removeOverlays() {
      let allOverlay = this.map.getOverlays()
      for (let i = allOverlay.length - 1; i >= 0; i--) {
        this.map.removeOverlay(allOverlay[i])
      }
    },
    updateToSelectLocation() {
      let allOverlay = this.map.getOverlays()
      let marker = null
      for (let i = allOverlay.length - 1; i >= 0; i--) {
        if (allOverlay[i].slowly) {
          marker = allOverlay[i]
          break
        }
      }
      if (!marker) {
        showError(this, "未选中点")
      } else {
        let latlng = bd2wgs(marker.point.lat, marker.point.lng)

        this.$confirm("确定修改位置？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            return updateLocation(latlng[0], latlng[1]).then(() => {
              let accountInfo = account.getAccount()
              accountInfo.location = `${latlng[0]},${latlng[1]}`
              account.setAccount(accountInfo)
              showSuccess(this, "修改成功")
            })
          })
          .catch(error => {
            if (error.message) {
              showError(this, error.message)
            } else if (error != "cancel") {
              showError(this, "修改位置失败：" + error)
            }
          })
      }
    },
    locate() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.showGpsLocation(
              position.coords.latitude,
              position.coords.longitude
            )
          },
          error => {
            console.log(error)
          }
        )
      } else {
        console.log("Location is not avaiable")
      }
      // const geolocation = new BMap.Geolocation()
      // geolocation.enableSDKLocation()
      // geolocation.getCurrentPosition(position => {
      //   if (position && position.point) {
      //     this.showGpsLocation(position.point.lat, position.point.lng)
      //   } else {
      //     console.log("Locate error")
      //   }
      //   console.log(position.point)
      // })
    }
  }
}
</script>


