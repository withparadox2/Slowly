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
  const localLocale = getLocalLocale()
  if (localLocale) {
    return localLocale
  }

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

const vueI18n = new VueI18n({
  locale: getPreferLang(),
  messages,
})

export function getLocaleList() {
  const prefLocale = getPreferLang()
  debugger
  return [
    {
      name: "en",
      text: "English",
    },
    {
      name: "zh-CN",
      text: "中文-简体",
    },
    {
      name: "zh-TW",
      text: "中文-簡體",
    },
  ].map((item) => {
    if (item.name === prefLocale) {
      item.selected = true
    }
    return item
  })
}

export function setLocale(locale) {
  locale && localStorage.setItem("local_select_locale", locale)
}

export function getLocalLocale() {
  return localStorage.getItem("local_select_locale")
}

export default vueI18n
