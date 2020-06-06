<template>
  <div class="modal"
       v-if="visible"
       @click="visible = false">
    <div class="content soft-scrollable">
      子夜的灯
      是一条未穿衣裳的
      小河
         
      你的信像一尾鱼游来
      读水的温暖
      读你额上动人的鳞片
         
      读江河如读一面镜
      读镜中你的笑
      如读泡沫

      — 子夜读信·洛夫
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.content
  position absolute
  top 5%
  bottom 0%
  right 10%
  left 10%
  color white
  white-space pre
  line-height 40px
  font-size 25px
  overflow-y auto
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


