<template>
  <el-dropdown ref="dropdown"
               trigger="click">
    <span>{{activeLocale}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="changeLocale(locale)"
                        :key="locale.name"
                        :class="{fontbold: locale.name === $i18n.locale}"
                        v-for="locale in localeList">{{locale.text}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { getLocaleList, setLocalLocale } from "../../i18n"
export default {
  computed: {
    localeList() {
      return getLocaleList()
    },
    activeLocale() {
      return this.localeList.filter(item => item.name === this.$i18n.locale)[0]
        .text
    }
  },
  methods: {
    show() {
      this.$refs.dropdown.show()
    },
    changeLocale(locale) {
      setLocalLocale(locale.name)
    }
  }
}
</script>