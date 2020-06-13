<template>
  <div>
    <el-popover placement="bottom"
                popper-class="email-popover"
                width="50%"
                trigger="manual"
                v-model="visible">
      <div>
        <div v-for="email in cachedEmails"
             :key="email"
             class="item"
             @click="checkEmail(email)">
          <el-row type="flex">
            <el-col :span="20">{{email}}</el-col>
            <el-col :span="4"
                    :title="$t('delete')"
                    class="el-remove-email"
                    @click.native.stop="removeEmail(email)">
              <i class="el-icon-delete"></i>
            </el-col>
          </el-row>
        </div>
      </div>

      <el-input v-bind:value="value"
                v-on:input="$emit('input', $event)"
                slot="reference"
                spellcheck="false"
                :clearable="true"
                :placeholder="$t('email_placeholder')" />
    </el-popover>
  </div>
</template>
<style lang="stylus">
.email-popover
  width 50%
  box-sizing border-box
  .item
    cursor pointer
.el-remove-email
  text-align right
</style>
<script>
export default {
  data() {
    return {
      visible: false,
      cachedEmails: []
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  watch: {
    value() {
      this.setPopupState()
    }
  },
  methods: {
    save(email) {
      if (!email) {
        email = this.value
      }

      const emails = this.loadEmails().filter(item => item != email)
      emails.splice(0, 0, email)
      this.saveEmails(emails)
    },
    loadEmails() {
      return JSON.parse(localStorage.getItem("email-cache-json") || "[]") || []
    },
    saveEmails(emails) {
      localStorage.setItem("email-cache-json", JSON.stringify(emails))
    },
    checkEmail(email) {
      this.$emit("input", email)
      this.$nextTick(() => {
        this.visible = false
      })
    },
    removeEmail(email) {
      this.saveEmails(this.loadEmails().filter(item => item != email))
      this.setPopupState()
    },
    setPopupState() {
      this.cachedEmails = this.loadEmails().filter(
        item => item.indexOf(this.value) >= 0
      )
      this.visible = !!(this.value && this.cachedEmails.length > 0)
    }
  },
  mounted() {
    const cachedEmails = this.loadEmails()
    if (cachedEmails.length > 0) {
      this.checkEmail(cachedEmails[0])
    }
  }
}
</script>