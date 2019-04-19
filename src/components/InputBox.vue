<template>
  <div class="input-container">
    <input v-model="content"
           :placeholder="placeHolder" />
    <i class="el-icon-search"></i>
    <i class="el-icon-close"
       @click="clear"
       v-show="searchValue"></i>
  </div>
</template>
<style lang="stylus" scoped>
.input-container
  width 100%
  max-width 400px
  height 32px
  position relative
  input
    position absolute
    box-sizing border-box
    width 100%
    left 0
    right 0
    top 0
    bottom 0
    border 0px
    border-radius 2px
    outline none
    background rgba(244, 246, 255, 0.8)
    padding 0 35px
    &:hover, &:focus
      background rgba(244, 246, 255, 1)
    &::placeholder
      color #346fef
  i
    color #346fef
    position absolute
    line-height 32px
  .el-icon-search
    left 10px
  .el-icon-close
    right 10px
    cursor pointer
</style>
<script>
import { mapState, mapMutations } from "vuex"

export default {
  data() {
    return {
      content: ""
    }
  },
  computed: {
    ...mapState(["searchValue", "checkedFriend"]),
    placeHolder() {
      return this.checkedFriend ? `搜索${this.checkedFriend.name}的信` : ""
    }
  },
  watch: {
    content(value) {
      this.setSearchValue(value)
    }
  },
  methods: {
    ...mapMutations(["setSearchValue"]),
    clear() {
      this.content = ""
    }
  }
}
</script>
