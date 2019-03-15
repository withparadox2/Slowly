<template>
  <div>
    <div v-for="friend in dataList"
         class="friend-item"
         :class="{checked: friend == checkedFriend}"
         @click="clickItem(friend)"
         :key="friend.user_id">
      {{friend.name}}
    </div>
  </div>
</template>
<style scoped>
.friend-item {
  cursor: pointer;
  padding: 10px;
  color: #34373d;
  font-size: 14px;
}
.friend-item.checked {
  background-color: #ededed;
}
.friend-item:hover {
  background-color: #f5f5f5;
  background: #fafafa;
}
</style>
<script>
export default {
  props: {
    dataList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      checkedFriend: ""
    }
  },
  methods: {
    clickItem(friend) {
      this.$emit("clickFriend", friend)
    }
  }
}
</script>

