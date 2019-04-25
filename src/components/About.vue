<template>
  <div class="modal"
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


