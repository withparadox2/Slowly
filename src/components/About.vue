<template>
  <div class="component-container"
       v-show="visible"
       @click="visible = false">
    <div class="content">
      在夜里
      在风中
      在永恒的梦境
      我，失去了你
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.component-container
  z-index 1000
  position fixed
  background rgba(0, 0, 0, 0.7)
  width 100%
  height 100%
  top 0
.content
  position absolute
  top 10%
  bottom 10%
  right 10%
  left 10%
  color white
  white-space pre
  line-height 90px
  font-size 50px
</style>
<script>
export default {
  data() {
    return {
      visible: false
    }
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


