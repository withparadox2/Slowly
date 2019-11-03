<template>
  <div>
    <div v-for="friend in friendList"
         class="friend-item"
         :class="{checked: friend == checkedFriend}"
         @click="checkFriend(friend)"
         :key="friend.user_id">
      <template v-if="!isExpand">
        <div class="header">{{friend.name.length > 0 && friend.name[0]}}</div>
      </template>
      <template v-else>
        {{friend.name}}
      </template>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.friend-item
  cursor pointer
  padding 10px 10px 10px 16px
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
</style>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['checkedFriend', 'friendList'])
  },
  methods: {
    ...mapMutations(['checkFriend'])
  },
  props: {
    isExpand: false
  }
}
</script>

