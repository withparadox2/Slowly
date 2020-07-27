<template>
  <div class="container"
       :class="{'mobile-mode': mobileMode, 'tablet-mode': tabletMode, 'mobile': isMobileEnv}">
    <div id="account-loading"
         v-if="!accountInfo"
         v-loading="!accountInfo"
         :element-loading-background="nightMode ? '#0c0b09' : 'white'"
         :element-loading-text="$t('loading_profile')">
    </div>
    <template v-else>
      <div class="nav-header">
        <img class="logo"
             :src="logo" />
        <span class="title">Slowly</span>
        <div class="middle">
          <input-box v-if="checkedFriend"></input-box>
        </div>
        <locale-switch class="menu-locale-list"
                       ref="localeList" />
        <el-dropdown class="menu-more"
                     trigger="click">
          <i class="el-icon-more"></i>`
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="editLocation">{{$t('change_location')}}</el-dropdown-item>
            <el-dropdown-item @click.native="$refs.localeList.show()">{{$t('change_locale')}}</el-dropdown-item>
            <el-dropdown-item @click.native="setTheme(!nightMode)">{{$t('change_theme')}}</el-dropdown-item>
            <el-dropdown-item @click.native="showChangeLog">{{$t('change_log')}}</el-dropdown-item>
            <el-dropdown-item @click.native="showFeedback">{{$t('feedback')}}</el-dropdown-item>
            <el-dropdown-item @click.native="showAbout">{{$t('about')}}</el-dropdown-item>
            <el-dropdown-item @click.native="exit()">{{$t('exit')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
      <div class="main-content">
        <div class="left-section"
             :class="{'left-section-exited' : leftSectionExited}">
          <div class="sidebar-header"
               v-if="tabletMode">
            <i class="icon-nav"
               :class="{'el-icon-arrow-right': leftSectionExited, 'el-icon-arrow-left': !leftSectionExited}"
               @click="leftSectionExited = !leftSectionExited"></i>
          </div>
          <div class="sidebar-content soft-scrollable">
            <friends :isExpand="!leftSectionExited" />
          </div>
        </div>
        <div class="left-section-overlay"
             :class="{entered: tabletMode && !leftSectionExited}"
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
    </template>
  </div>
</template>
<style lang="stylus" scoped>
@require ('../styles/var.styl')
.night-mode
  .nav-header
    background-color $main-color-night
    color $color-white-night
    .el-icon-more
      color $color-white-night
    .el-icon-more:hover
      background-color $main-color-night-dark
  .left-section
    background #1A1712
    .sidebar-header
      .icon-nav
        color #5F587A
        box-shadow 0 0 0 1px #1B1A16
        background-color #0C0B09
  .main-content
    background #0C0B09
    color $color-white-night
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
  .menu-more
    cursor pointer
  .menu-locale-list
    position absolute
    right 0
    height 48px
    color transparent
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
  flex 1 1 0%
  box-sizing border-box
  overflow hidden
.tablet-mode
  .main-content
    padding-left 50px
.mobile .left-section.left-section-exited
  width 50px
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
  transition width 180ms ease
  &.left-section-exited
    width 60px
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
.tablet-mode .left-section
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
import { showError, showSuccess, isMobile } from "../util"
import * as friendStore from "../persist/friend-store"
import * as account from "../persist/account"
import { getDataManager } from "../persist/letter-store"
import { sortFriends } from "../helper"
import getOtp from "../otp"

import Friends from "../components/Friends.vue"
import Letters from "../components/Letters.vue"
import InputBox from "../components/InputBox.vue"
import QuoteNode from "../components/Quote.vue"
import Version from "../components/Version.vue"
import LocaleSwitch from "../components/common/LocaleSwitch.vue"

import MapNode from "./Map.vue"
import ChangeLog from "./ChangeLog.vue"
import About from "./About.vue"

import LogoNight from "../images/ic_logo_night.svg"
import Logo from "../images/ic_logo.svg"

export default {
  data() {
    return {
      accountInfo: null,
      leftSectionExited: true,
      isMobileEnv: isMobile(),
    }
  },
  components: {
    Friends,
    Letters,
    MapNode,
    InputBox,
    QuoteNode,
    About,
    ChangeLog,
    Version,
    LocaleSwitch,
  },
  computed: {
    ...mapState([
      "checkedFriend",
      "friendList",
      "mobileMode",
      "tabletMode",
      "nightMode",
    ]),
    logo() {
      return this.nightMode ? LogoNight : Logo
    },
  },
  methods: {
    ...mapMutations(["setFriends", "setTheme"]),
    exit(message) {
      this.$confirm(message || this.$t("warn_exit"), this.$t("tip"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
      })
        .then(() => {
          account.clear()
          this.goLogin()
        })
        .catch(() => {})
    },
    goLogin() {
      this.$router.replace({
        name: "login",
      })
    },
    showMap(friend) {
      this.$refs.map.showMap(friend)
    },
    loadFriends() {
      const updateLastPosition = () => {
        const LOCATION_KEY = `location-${this.accountInfo.id}`
        const localObj = JSON.parse(localStorage.getItem(LOCATION_KEY) || "{}")
        api
          .getIncomingLetters()
          .then((response) => {
            const list = (response.data && response.data.comments.data) || []
            list.forEach((item) => {
              if (item.avatar) {
                const matchResult = item.avatar.match(/user\/(.*)\/.*/)
                if (matchResult.length > 1) {
                  localObj[matchResult[1]] = item.user_location
                }
              }
            })
            localStorage.setItem(LOCATION_KEY, JSON.stringify(localObj))
            this.friendList.forEach((friend) => {
              friend.user_location = localObj[friend.user_id]
            })
          })
          .catch((_) => {})
      }
      const loadFromServer = () => {
        api
          .getFriends()
          .then(({ data }) => {
            this.setFriends(sortFriends(data.friends))
            friendStore.insertFriends(this.friendList)
            updateLastPosition()
          })
          .catch((err) => this.$errorHandler(err))
      }
      friendStore
        .getFriends()
        .then((list = []) => {
          this.setFriends(sortFriends(list))
          if (list.length == 0 || !__CONFIG__.useCache) {
            loadFromServer()
          }
        })
        .catch((e) => {
          console.error(e)
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
    },
    showFeedback() {
      this.$alert(this.$t("feedback_msg"), this.$t("feedback"), {
        confirmButtonText: this.$t("soft_confirm"),
      })
    },
  },
  watch: {
    checkedFriend(val) {
      if (this.tabletMode) {
        this.leftSectionExited = true
      }
    },
    tabletMode() {
      if (!this.tabletMode) {
        this.leftSectionExited = false
      }
    },
  },
  mounted() {
    if (!account.getToken()) {
      this.goLogin()
      return
    }

    this.leftSectionExited = this.tabletMode

    this.accountInfo = account.getAccount()
    if (!this.accountInfo) {
      api
        .getMe()
        .then((response) => {
          this.accountInfo = response.data
          account.setAccount(this.accountInfo)
          this.loadFriends()
        })
        .catch((err) => {
          this.$errorHandler({
            ...err,
            exitLogin: true,
          })
        })
    } else {
      this.loadFriends()
      api
        .getMe()
        .then((response) => {
          account.setAccount(response.data)
        })
        .catch((err) => {
          const showLogin = this.$errorHandler({
            ...err,
          })
          if (!showLogin) {
            this.exit(this.$t("fail_to_load_profile"))
          }
        })
    }
  },
}
</script>
