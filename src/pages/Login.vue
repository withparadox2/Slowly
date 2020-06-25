<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="header">
        <transition name="fade">
          <i class="el-icon-back back-to-email"
             v-show="showPasscode"
             @click="backToEmail"></i>
        </transition>
        <a href="https://www.getslowly.com/en/"
           class="title-link">
          <span class="title">Slowly</span>
        </a>
        <el-dropdown class="locale-list"
                     ref="localeList"
                     trigger="click">
          <span class="">{{activeLocale}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changeLocale(locale)"
                              :key="locale.name"
                              :style="{'font-weight': locale.name === $i18n.locale ? 'bold' : ''}"
                              v-for="locale in localeList">{{locale.text}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="form-wrapper">
        <transition-group :name="fadeName"
                          mode="out-in">
          <div class="content-wrapper"
               :key="1"
               v-show="!showPasscode">
            <email-input v-model="email"
                         ref="emailInput" />
            <el-button class="login-button"
                       type="primary"
                       icon="el-icon-message"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       @click.native="sendEmail">{{$t('login_with_email')}}</el-button>
          </div>
          <div class="content-wrapper"
               :key="2"
               v-show="showPasscode">
            <el-input v-model="passcode"
                      spellcheck="false"
                      :placeholder="$t('verify_code')" />
            <el-button class="login-button"
                       type="primary"
                       icon="el-icon-message"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       @click.native="login">{{$t('sign_in')}}</el-button>
          </div>
        </transition-group>
      </div>
    </div>
    <version />
  </div>
</template>
<style lang="stylus" scoped>
.page-wrapper
  overflow-x hidden
.container
  width 50%
  margin 10% auto 0 auto
.header
  margin-bottom 40px
  position relative
.title-link
  text-decoration none
.title
  color #66b1ff
  text-shadow 2px 2px 8px #66b1ff
  font-size 30px
.back-to-email
  display inline-block
  font-size 26px
  color #66b1ff
  position absolute
  margin-top 7px
  margin-left -50px
  cursor pointer
.locale-list
  cursor pointer
  color #66b1ff
  float right
  margin-top 12px
.form-wrapper
  position relative
  height 200px
.content-wrapper
  position absolute
  width 100%
.login-button
  margin 30px auto 0 auto
  width 100%
.tip-text
  text-align center
  margin-top 40px
.slide-out-enter-active, .slide-out-leave-active, .slide-in-enter-active, .slide-in-leave-active
  transition all 0.4s ease
.slide-out-enter
  transform translate(-100%, 0)
  opacity 0
.slide-in-enter
  transform translate(100%, 0)
  opacity 0
.slide-out-leave-to
  transform translate(100%, 0)
  opacity 0
.slide-in-leave-to
  transform translate(-100%, 0)
  opacity 0
</style>

<script>
import { validateEmail, showError, showSuccess } from "../util"
import { sendEmailPasscode, verifyPasscode } from "../api"
import { setToken, getToken } from "../persist/account"
import { getLocaleList, setLocalLocale } from "../i18n"
import EmailInput from "../components/EmailInput.vue"
import Version from "../components/Version.vue"

export default {
  data() {
    return {
      email: "",
      passcode: "",
      fullscreenLoading: false,
      showPasscode: false,
      localeList: getLocaleList()
    }
  },
  components: {
    EmailInput,
    Version
  },
  computed: {
    fadeName() {
      return this.showPasscode ? "slide-in" : "slide-out"
    },
    activeLocale() {
      return this.localeList.filter(item => item.selected)[0].text
    }
  },
  methods: {
    changeLocale(locale) {
      setLocalLocale(locale.name)
    },
    sendEmail() {
      if (!validateEmail(this.email)) {
        showError(this, this.$t("error_email"))
        return
      }

      this.fullscreenLoading = true
      sendEmailPasscode(this.email)
        .then(response => {
          this.fullscreenLoading = false
          if (response && response.data && response.data.success) {
            showSuccess(this, `${this.$t("send_code_to")}${this.email}`)
            this.showPasscode = true
            this.$refs.emailInput.save()
          }
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$errorHandler(err)
        })
    },
    login() {
      if (!this.passcode) {
        showError(this, this.$t("input_code"))
        return
      }
      this.fullscreenLoading = true
      verifyPasscode(this.email, this.passcode)
        .then(response => {
          this.fullscreenLoading = false
          if (response && response.data && response.data.token) {
            setToken(response.data.token)
            this.$router.replace({
              name: "home"
            })
          }
        })
        .catch(err => {
          this.fullscreenLoading = false
          this.$errorHandler(err)
        })
    },
    backToEmail() {
      this.showPasscode = false
    }
  },
  mounted() {
    if (getToken()) {
      this.$router.replace({
        name: "home"
      })
    }
  }
}
</script>
