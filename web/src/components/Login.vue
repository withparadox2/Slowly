<template>
  <div>
    <div class="container">
      <div class="title">Slowly</div>
      <el-input v-model="input"
                placeholder="电邮"></el-input>
      <el-button class="login-button"
                 type="primary"
                 icon="el-icon-message"
                 v-loading.fullscreen.lock="fullscreenLoading"
                 @click.native="sendEmail">透过电邮登入</el-button>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 50%;
  margin: 10% auto 0 auto;
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
</style>

<script>
import { validateEmail, showError } from "../util"
import { sendEmailPasscode } from "../api"
export default {
  data() {
    return {
      input: "",
      fullscreenLoading: false
    }
  },
  methods: {
    sendEmail() {
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
        .catch(({ error, message }) => {
          this.fullscreenLoading = false
          showError(this, message)
        })
    }
  }
}
</script>
