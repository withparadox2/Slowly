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
          {{email}}
        </div>
      </div>
      <el-input v-bind:value="value"
                v-on:input="$emit('input', $event)"
                slot="reference"
                spellcheck="false"
                placeholder="电邮" />
    </el-popover>
  </div>
</template>
<style lang="stylus">
.email-popover
  width 50%
  box-sizing border-box
  .item
    cursor pointer
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
      this.cachedEmails = this.loadEmails().filter(
        item => item.indexOf(this.value) >= 0
      )
      this.visible = !!(this.value && this.cachedEmails.length > 0)
    }
  },
  methods: {
    save(email) {
      if (!email) {
        email = this.value
      }

      let emails = this.loadEmails()
      for (let i = 0; i < emails.length; i++) {
        if (emails[i] == email) {
          emails.splice(i, 1)
          break
        }
      }

      emails.splice(0, 0, email)

      localStorage.setItem("email-cache-json", JSON.stringify(emails))
    },
    loadEmails() {
      return JSON.parse(localStorage.getItem("email-cache-json") || "[]") || []
    },
    checkEmail(email) {
      this.$emit("input", email)
      this.$nextTick(() => {
        this.visible = false
      })
    }
  }
}
</script>