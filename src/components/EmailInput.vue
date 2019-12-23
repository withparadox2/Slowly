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

      const emails = this.loadEmails().filter(item => item != email)
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
  },
  mounted() {
    const cachedEmails = this.loadEmails()
    if (cachedEmails.length > 0) {
      this.checkEmail(cachedEmails[0])
    }
  }
}
</script>