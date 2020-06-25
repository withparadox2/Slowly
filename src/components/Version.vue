<template>
  <div class="new-version"
       @click="updateNewVersion()"
       v-if="newVersion">
    <div>{{$t("click_to_update")}}</div>
    <ul v-if="newVersion.content && newVersion.content.length > 0">
      <li v-for="item in newVersion.content"
          :key="item">
        <span>{{item}}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="stylus" scoped>
@require ('../styles/var.styl')
.new-version
  position fixed
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
  white-space pre-line
  max-width 200px
  ul
    margin 0
    list-style-position inside
    padding-left 0
    span
      position relative
      left -8px
</style>

<script>
import { mapMutations } from "vuex"
import { checkVersion, updateVersion } from "../update"

export default {
  data() {
    return {
      newVersion: false
    }
  },
  methods: {
    ...mapMutations(["setChangeLog"]),
    updateNewVersion() {
      updateVersion()
    }
  },
  mounted() {
    checkVersion().then(result => {
      if (result) {
        if (result.newVersion) {
          this.newVersion = result.newVersion
        }
        this.setChangeLog(result.changeLog)
      }
    })
  }
}
</script>