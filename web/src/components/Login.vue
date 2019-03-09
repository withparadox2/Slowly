<template>
  <div>
    <div class="container">
      <div class="title">Slowly</div>
      <div class="form-wrapper">
        <transition-group name="fade"
                          mode="out-in">
          <div class="content-wrapper"
               :key="1"
               v-show="!showPasscode">
            <el-input v-model="email"
                      placeholder="电邮"></el-input>
            <el-button class="login-button"
                       type="primary"
                       icon="el-icon-message"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       @click.native="sendEmail">透过电邮登入</el-button>
          </div>
          <div class="content-wrapper"
               :key="2"
               v-show="showPasscode">
            <el-input v-model="passcode"
                      placeholder="验证码"></el-input>
            <el-button class="login-button"
                       type="primary"
                       icon="el-icon-message"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       @click.native="login">登入</el-button>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 50%;
  margin: 10% auto 0 auto;
}
.form-wrapper {
  position: relative;
  overflow-x: hidden;
}
.content-wrapper {
  position: absolute;
  width: 100%;
}
.login-button {
  margin: 30px auto 0 auto;
  width: 100%;
}
.title {
  color: #66b1ff;
  text-shadow: 2px 2px 8px #66b1ff;
  font-size: 30px;
  margin-bottom: 40px;
}
.tip-text {
  text-align: center;
  margin-top: 40px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 100.4s ease;
}
.fade-enter {
  transform: translate(100%, 0);
  opacity: 0;
}
.fade-leave-to {
  transform: translate(-100%, 0);
  opacity: 0;
}
</style>

<script>
import { validateEmail, showError } from "../util"
import { sendEmailPasscode, verifyPasscode } from "../api"
export default {
  data() {
    return {
      email: "",
      passcode: "",
      fullscreenLoading: false,
      showPasscode: false
    }
  },
  methods: {
    sendEmail() {
      this.showPasscode = true
      if (!validateEmail(this.input)) {
        showError(this, "请输入正确的邮箱格式")
        return
      }

      this.fullscreenLoading = true
      sendEmailPasscode(this.input)
        .then(response => {
          this.fullscreenLoading = false
          if (response && response.data && response.data.success) {
            this.$message({
              message: "验证码已发送至" + this.input,
              type: "success"
            })
          }
        })
        .catch(({ message }) => {
          this.fullscreenLoading = false
          showError(this, message)
        })
    },
    login() {}
  }
}
</script>
