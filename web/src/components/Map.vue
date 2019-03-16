<template>
  <div class="map-container"
       v-show="mapVisible">
    <div class="map-wrapper">
      <div id="map"></div>
    </div>
    <i class="btn-close-map el-icon-circle-close"
       @click="mapVisible = false" />
  </div>
</template>
<style scoped>
.map-container {
  z-index: 999;
  position: fixed;
  background: #000000aa;
  width: 100%;
  height: 100%;
  top: 0;
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
  margin-right: -55px;
  white-space: nowrap;
  color: white;
  cursor: pointer;
  text-align: right;
  font-size: 30px;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
<script>
export default {
  data() {
    return {
      map: null,
      mapVisible: false
    }
  },
  methods: {
    showMap(friend) {
      this.mapVisible = true
      this.$nextTick(() => {
        if (!this.map) {
          this.map = new BMap.Map("map")
          this.map.enableScrollWheelZoom(true)
        }
        this.removeOverlays()
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
    removeOverlays() {
      let allOverlay = this.map.getOverlays()
      for (let i = 0; i < allOverlay.length - 1; i++) {
        this.map.removeOverlay(allOverlay[i])
      }
    }
  }
}
</script>


