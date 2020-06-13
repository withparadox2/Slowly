<template>
  <div class="input-container">
    <input v-model="content"
           ref="input"
           spellcheck="false"
           :class="{'has-content': content}"
           @focus="inputFocus = true"
           @blur="inputFocus = false" />
    <span v-if="checkedFriend && !content && !inputFocus"
          class="placeholder">
      {{$t('search_placeholder_prefix')}}<span class="name">{{checkedFriend.name}}</span>{{$t('search_placeholder_suffix')}}
    </span>
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
    &:hover, &:focus, &.has-content
      background rgba(244, 246, 255, 1)
  .placeholder
    font-size 13px
    line-height 32px
    margin-left 35px
    color #346fef
    position absolute
    pointer-events none
    .name
      font-weight bold
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
      content: "",
      inputFocus: false
    }
  },
  computed: {
    ...mapState(["searchValue", "checkedFriend"])
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
