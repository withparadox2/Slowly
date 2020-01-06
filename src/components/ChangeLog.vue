<template>
  <div class="modal"
       v-if="visible"
       @click="visible = false">
    <div class="content soft-scrollable">
      <template v-if="changeLog">
        <div v-for="log in changeLog"
             :key="log.versionCode">
          <div class="version-name">
            {{log.versionName}}
          </div>
          <div class="version-content">{{log.content}}</div>
        </div>
      </template>
      <div v-else>
        正在加载...
      </div>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.content
  position absolute
  top 5%
  bottom 5%
  right 0
  left 10%
  color white
  font-size 14px
  overflow-y auto
  .version-content
    white-space pre-line
    line-height 22px
  .version-name
    white-space nowrap
    margin-top 20px
</style>
<script>
import { mapState } from "vuex"
export default {
  data() {
    return {
      visible: false
    }
  },
  computed: {
    ...mapState(["changeLog"])
  },
  methods: {
    show() {
      this.visible = true
      console.log(this.changeLog)
    },
    hide() {
      this.visible = false
    }
  }
}
</script>


