<template>
  <div class="modal">
    <div class="content">
      <div class="stamp-wrapper"
           @click="selectStamp(stamp.item_slug)"
           v-for="stamp in stamps"
           :key="stamp.slug">
        <img :src="stamp.item_slug | stampUrl"
             class="stamp" />
      </div>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
@require ('../styles/var.styl')
.modal
  color white
  background #f5f5f5
  overflow-y auto
  padding 20px 0
.content
  max-width 1000px
  margin 0px auto
  display flex
  flex-wrap wrap
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
</style>
<script>
import * as account from "../persist/account"

export default {
  data() {
    return {
      stamps: account.getAccount().items || []
    }
  },
  methods: {
    selectStamp(stamp) {
      this.$emit("select", stamp)
    }
  }
}
</script>