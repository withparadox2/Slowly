<template>
  <div>
    <div v-for="friend in friendList"
         class="friend-item"
         :key="friend.user_id">
      {{friend.name}}
    </div>
  </div>
</template>
<style scoped>
.friend-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px #00000033 solid
}
</style>
<script>
import { getFriends } from "../api"
import { showError } from "../util"
export default {
  data() {
    return {
      friendList: []
    }
  },
  mounted() {
    // getFriends()
    //   .then(response => {
    //     this.friendList = (response.data && response.data.friends) || []
    //   })
    //   .catch(({ message }) => showError(this, message))
  }
}
</script>
