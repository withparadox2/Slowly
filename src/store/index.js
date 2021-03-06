import Vuex from "vuex"
import Vue from "vue"
import { configTheme } from "../helper"

Vue.use(Vuex)

const KEY_NIGHT_MODE = "is_night_mode"

function getIsNightMode() {
  const mode = localStorage.getItem(KEY_NIGHT_MODE, false)
  return mode === true || mode === "true"
}

export const store = new Vuex.Store({
  state: {
    checkedFriend: null,
    friendList: [],
    searchValue: "",
    mobileMode: false,
    tabletMode: false,
    changeLog: null,
    nightMode: getIsNightMode(),
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
    },
    setTabletMode(state, value) {
      state.tabletMode = value
    },
    setTheme(state, isNightMode) {
      state.nightMode = isNightMode
      localStorage.setItem(KEY_NIGHT_MODE, isNightMode)
      configTheme(isNightMode)
    },
  },
})

configTheme(store.state.nightMode)
