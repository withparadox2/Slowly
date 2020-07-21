<template>
  <div>
    <div v-for="friend in friendList"
         class="friend-item"
         :class="{checked: friend == checkedFriend}"
         @click="checkFriend(friend)"
         :key="friend.user_id">
      <div class="header">
        <img :src="getUserAvatar(friend)" />
        <span v-show="isExpand"
              class="name">{{friend.name}}</span>
      </div>
    </div>
  </div>
</template>
<style lang="stylus">
.left-section-exited .friend-item .header
  overflow initial
</style>
<style lang="stylus" scoped>
@require ('../styles/var.styl')
.night-mode
  .friend-item
    color $color-white-night
  .friend-item:hover
    background-color #0C0B09
  .friend-item.checked
    background-color #0C0B09

.friend-item
  cursor pointer
  padding 10px
  color #34373d
  font-size 14px
  transition background-color 200ms linear
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
.friend-item:hover
  background-color #f5f5f5
.friend-item.checked
  background-color #ffffff
.header
  display flex
  align-items center
  overflow hidden
  img
    width 30px
    height 30px
    border-radius 30px
  .name
    margin-left 10px
    text-overflow ellipsis
    overflow hidden
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

