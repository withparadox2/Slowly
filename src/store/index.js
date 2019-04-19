import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    checkedFriend: null,
    friendList: [],
    searchValue: ""
  },
  mutations: {
    setFriends(state, list) {
      state.friendList = list
    },
    checkFriend(state, friend) {
      state.checkedFriend = friend
    },
    setSearchValue(state, value) {
      state.searchValue = value
    }
  }
})