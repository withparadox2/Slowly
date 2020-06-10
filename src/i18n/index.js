import Vue from "vue"
import VueI18n from "vue-i18n"

import en from "./locale/en.json"
import zhCN from "./locale/zh-CN.json"
import zhTW from "./locale/zh-TW.json"

Vue.use(VueI18n)

const messages = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
}

function getPreferLang() {
  const navigatorLang =
    navigator && (navigator.language || navigator.userLanguage)

  if (navigatorLang & messages[navigatorLang]) {
    return navigatorLang
  }

  if (navigatorLang && navigatorLang.startsWith("zh")) {
    if (navigatorLang === "zh-CN") {
      return "zh-CN"
    } else {
      return "zh-TW"
    }
  }
  return "en"
}

export default new VueI18n({
  locale: getPreferLang(),
  messages,
})
