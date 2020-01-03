import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import { getAccount } from '../persist/account'

export const store = new Vuex.Store({
  state: {
    checkedFriend: null,
    friendList: [],
    searchValue: "",
    mobileMode: false,
    changeLog: null
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
    },
    setMobileMode(state, value) {
      state.mobileMode = value
    },
    setChangeLog(state, changeLog) {
      state.changeLog = changeLog
    }
  }
})