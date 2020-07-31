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
          <ul class="version-content">
            <li v-for="item in log.contentItems"
                :key="item">
              <span>{{item}}</span>
            </li>
          </ul>
        </div>
      </template>
      <div v-else>
        {{$t('loading')}}
      </div>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
@require ('../styles/var.styl')
.night-mode
  .content
    color $color-white-night
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
    line-height 22px
    margin 0
    list-style-position inside
    padding-left 0
    span
      position relative
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
    },
    hide() {
      this.visible = false
    }
  }
}
</script>
