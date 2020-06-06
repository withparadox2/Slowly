<template>
  <div class="container"
       :class="{'mobile-mode' : mobileMode}">
    <div id="account-loading"
         v-if="!accountInfo"
         v-loading="!accountInfo"
         element-loading-text="加载个人信息...">
    </div>
    <div class="nav-header">
      <img class="logo"
           src="../../images/ic_logo.svg" />
      <span class="title">Slowly</span>
      <div class="middle">
        <input-box v-if="checkedFriend"></input-box>
      </div>
      <el-dropdown class="menu-more"
                   trigger="click">
        <i class="el-icon-more"></i>`
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="editLocation">修改位置</el-dropdown-item>
          <el-dropdown-item @click.native="showAbout">关于</el-dropdown-item>
          <el-dropdown-item @click.native="showChangeLog">更新内容</el-dropdown-item>
          <el-dropdown-item @click.native="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="main-content">
      <div class="left-section"
           :class="{'left-section-exited' : leftSectionExited}">
        <div class="sidebar-header"
             v-if="mobileMode">
          <i class="icon-nav"
             :class="{'el-icon-arrow-right': leftSectionExited, 'el-icon-arrow-left': !leftSectionExited}"
             @click="leftSectionExited = !leftSectionExited"></i>
        </div>
        <div class="sidebar-content soft-scrollable">
          <friends :isExpand="!leftSectionExited" />
        </div>
      </div>
      <div class="left-section-overlay"
           :class="{entered: mobileMode && !leftSectionExited}"
           @click="leftSectionExited = true"></div>
      <div class="right-section">
        <letters v-on:showMap="showMap($event)"
                 v-show="checkedFriend" />
        <quote-node v-show="!checkedFriend"></quote-node>
      </div>
    </div>
    <version />
    <map-node ref="map" />
    <about ref="about" />
    <change-log ref="changeLog" />
  </div>
</template>
<style lang="stylus" scoped>
@require ('../var.styl')
.nav-header
  background-color $main-color
  height 48px
  color white
  display flex
  .logo
    margin-left 10px
    width 25px
  .title
    font-size 18px
    line-height 48px
    margin-left 10px
    margin-right 10px
  .middle
    flex 1
    display flex
    align-items center
    justify-content center
    flex-direction row
  .btn-exit
    font-size 14px
    line-height 48px
    float right
    padding 0 20px
    cursor pointer
  .btn-exit:hover
    background-color $main-color-dark
  .menu-more
    cursor pointer
  .el-icon-more
    color white
    line-height 48px
    padding 0 20px
    display block
  .el-icon-more:hover
    background-color $main-color-dark
.main-content
  position absolute
  top 48px
  left 0
  right 0
  bottom 0
  display flex
  flex 1 1 0px
  box-sizing border-box
  overflow hidden
.mobile-mode
  .main-content
    padding-left 50px
.left-section
  background #f4f4f4
  width 200px
  height 100%
  display flex
  flex-direction column
  position relative
  box-sizing border-box
  overflow hidden
  z-index 60
  border-right 1px solid #eaeaea
  transition width 180ms ease
  &.left-section-exited
    width 50px
  .sidebar-header
    display flex
    align-items center
    flex-shrink 0
    height 48px
    margin-top 12px
    justify-content space-between
    padding 0 8px
    .icon-nav
      padding 0
      margin 0
      width 32px
      height 32px
      color #465efc
      text-align center
      line-height 32px
      background-color #fafafa
      box-shadow 0 0 0 1px #ededed
  .sidebar-content
    flex 1
    overflow-y auto
    overflow-x hidden
.left-section-overlay
  position absolute
  top 0
  bottom 0
  right 0
  left 0
  background #333
  z-index 50
  opacity 0
  transition opacity 180ms ease
  pointer-events none
  &.entered
    pointer-events all
    opacity 0.4
.mobile-mode .left-section
  position absolute
  top 0
  bottom 0
  left 0
.right-section
  flex 1
  overflow hidden
  position relative
#account-loading
  z-index 1000
  position fixed
  width 100%
  height 100%
  background white
</style>
<script>
import { mapState, mapMutations } from "vuex"
import * as api from "../api"
import { showError, showSuccess } from "../util"
import * as friendStore from "../persist/friend-store"
import * as account from "../persist/account"
import { getDataManager } from "../persist/letter-store"
import { sortFriends } from "../helper"
import getOtp from "../genOtp"

import Friends from "../components/Friends.vue"
import Letters from "../components/Letters.vue"
import InputBox from "../components/InputBox.vue"
import Quote from "../components/Quote.vue"
import Version from "../components/Version.vue"

import Map from "./Map.vue"
import ChangeLog from "./ChangeLog.vue"
import About from "./About.vue"

export default {
  data() {
    return {
      accountInfo: null,
      leftSectionExited: true
    }
  },
  components: {
    Friends,
    Letters,
    "map-node": Map,
    InputBox,
    "quote-node": Quote,
    About,
    ChangeLog,
    Version
  },
  computed: {
    ...mapState(["checkedFriend", "friendList", "mobileMode"])
  },
  methods: {
    ...mapMutations(["setFriends"]),
    exit() {
      this.$confirm("退出后数据仍在，是否确定退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          account.clear()
          this.goLogin()
        })
        .catch(() => {})
    },
    goLogin() {
      this.$router.replace({
        name: "login"
      })
    },
    showMap(friend) {
      this.$refs.map.showMap(friend)
    },
    loadFriends() {
      let loadFromServer = () => {
        api
          .getFriends()
          .then(({ data }) => {
            this.setFriends(sortFriends(data.friends))
            friendStore.insertFriends(this.friendList)
          })
          .catch(err => this.$errorHandler(err))
      }
      friendStore
        .getFriends()
        .then((list = []) => {
          this.setFriends(sortFriends(list))
          if (list.length == 0 || !__CONFIG__.useCache) {
            loadFromServer()
          }
        })
        .catch(() => {
          loadFromServer()
        })
    },
    editLocation() {
      this.$refs.map.editLocation()
    },
    showAbout() {
      this.$refs.about.show()
    },
    showChangeLog() {
      this.$refs.changeLog.show()
    }
  },
  watch: {
    checkedFriend(val) {
      if (this.mobileMode) {
        this.leftSectionExited = true
      }
    },
    mobileMode() {
      if (!this.mobileMode) {
        this.leftSectionExited = false
      }
    }
  },
  mounted() {
    if (!account.getToken()) {
      this.goLogin()
      return
    }

    this.leftSectionExited = this.mobileMode

    this.accountInfo = account.getAccount()
    if (!this.accountInfo) {
      api
        .getTime()
        .then(response => {
          let curTime = response.data.now
          const otp = getOtp(curTime)
          return api.getMe(otp)
        })
        .then(response => {
          this.accountInfo = response.data
          account.setAccount(this.accountInfo)
          this.loadFriends()
        })
        .catch(err =>
          this.$errorHandler({
            ...err,
            exitLogin: true
          })
        )
    } else {
      this.loadFriends()
      api
        .getTime()
        .then(response => {
          let curTime = response.data.now
          const otp = getOtp(curTime, this.accountInfo.id)
          return api.getMe(otp)
        })
        .then(response => {
          account.setAccount(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
