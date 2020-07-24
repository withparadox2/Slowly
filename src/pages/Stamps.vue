<template>
  <div class="modal soft-scrollable">
    <div class="close-wrapper">
      <i class="el-icon-close btn-close-stamps"
         @click="selectStamp()" />
    </div>

    <div class="content">
      <div class="stamp-wrapper"
           @click="selectStamp(stamp.item_slug)"
           v-for="stamp in stamps"
           :key="stamp.slug">
        <img :src="stamp.item_slug | stampUrl"
             class="stamp" />
        <div class="stamp-desc">{{stamp.item_name}}</div>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
@require ('../styles/var.styl')
.night-mode
  .modal, .close-wrapper
    background rgb(25, 22, 17)
  .btn-close-stamps, .stamp-desc
    color rgb(163, 139, 115)
.modal
  color white
  background #f5f5f5
  overflow-y auto
  padding 20px 0
.close-wrapper
  position fixed
  top 0
  right 0
  left 0
  height 40px
  background #f5f5f5
  display flex
  justify-content flex-end
  align-items center
.btn-close-stamps
  display block
  color #333
  font-size 20px
  margin-right 40px
  cursor pointer
.content
  max-width 1000px
  margin 0px auto
  display flex
  flex-wrap wrap
  clear both
.stamp-wrapper
  width 16.66666%
  text-align center
  +breakpoint(tablet)
    width 25%
  +breakpoint(mobile)
    width 33.33333%
.stamp
  width 100px
  max-width 95%
  display block
  margin 0px auto
  cursor pointer
  padding-top 15px
.stamp-desc
  color #333
  font-size 13px
</style>
<script>
import * as account from "../persist/account"

export default {
  data() {
    return {
      stamps: account.getAccount().items || [],
    }
  },
  methods: {
    selectStamp(stamp) {
      this.$emit("select", stamp)
    },
  },
}
</script>