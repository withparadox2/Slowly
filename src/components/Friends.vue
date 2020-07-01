<template>
  <div>
    <div v-for="friend in friendList"
         class="friend-item"
         :class="{checked: friend == checkedFriend}"
         @click="checkFriend(friend)"
         :key="friend.user_id">
      <div class="header">
        <img :src="getUserAvatar(friend)" />
        <span v-show="isExpand">{{friend.name}}</span>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.friend-item
  cursor pointer
  padding 10px 10px 10px 10px
  color #34373d
  font-size 14px
  transition background-color 200ms linear
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
.friend-item.checked
  background-color #ededed
.friend-item:hover
  background-color #f5f5f5
  background #fafafa
.header
  display flex
  align-items center
  img
    width 30px
    height 30px
    border-radius 30px
    margin-right 10px
</style>
<script>
import { mapState, mapMutations } from "vuex"

export default {
  computed: {
    ...mapState(["checkedFriend", "friendList"])
  },
  methods: {
    ...mapMutations(["checkFriend"]),
    getUserAvatar(friend) {
      return `https://cdn.getslowly.com/assets/images/avatar/${friend.gender}/${friend.avatar}.png`
    }
  },
  props: {
    isExpand: false
  }
}
</script>

