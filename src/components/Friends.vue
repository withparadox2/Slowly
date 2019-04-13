<template>
  <div>
    <div v-for="friend in friendList"
         class="friend-item"
         :class="{checked: friend == checkedFriend}"
         @click="checkFriend(friend)"
         :key="friend.user_id">
      {{friend.name}}
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.friend-item
  cursor pointer
  padding 10px
  color #34373d
  font-size 14px
.friend-item.checked
  background-color #ededed
.friend-item:hover
  background-color #f5f5f5
  background #fafafa
</style>
<script>
import { mapState, mapMutations } from "vuex"

export default {
  computed: {
    ...mapState(["checkedFriend", "friendList"])
  },
  methods: {
    ...mapMutations(["checkFriend"])
  }
}
</script>

