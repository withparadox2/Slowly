import Vue from "vue"
import VueI18n from "vue-i18n"

import en from "./locale/en.json"
import zhCN from "./locale/zh-CN.json"
import zhTW from "./locale/zh-TW.json"

const KEY_SELECTED_LOCALE = "local_select_locale"

const LOCALE_EN = "en"
const LOCALE_ZH_CN = "zh-CN"
const LOCALE_ZH_TW = "zh-TW"

const localeMap = {
  [LOCALE_EN]: en,
  [LOCALE_ZH_CN]: zhCN,
  [LOCALE_ZH_TW]: zhTW,
}

Vue.use(VueI18n)

function getPreferLang() {
  const localLocale = getLocalLocale()
  if (localLocale) {
    return localLocale
  }

  const navigatorLang =
    navigator && (navigator.language || navigator.userLanguage)

  if (navigatorLang & localeMap[navigatorLang]) {
    return navigatorLang
  }

  if (navigatorLang && navigatorLang.startsWith("zh")) {
    if (navigatorLang === LOCALE_ZH_CN) {
      return LOCALE_ZH_CN
    } else {
      return LOCALE_ZH_TW
    }
  }

  return LOCALE_EN
}

export default new VueI18n({
  locale: getPreferLang(),
  messages: localeMap,
})

export function getLocaleList() {
  const preferLocale = getPreferLang()
  return [
    {
      name: LOCALE_ZH_CN,
      text: "中文-简体",
    },
    {
      name: LOCALE_ZH_TW,
      text: "中文-繁體",
    },
    {
      name: LOCALE_EN,
      text: "English",
    },
  ].map((item) => {
    if (item.name === preferLocale) {
      item.selected = true
    }
    return item
  })
}

export function setLocalLocale(locale) {
  locale && localStorage.setItem(KEY_SELECTED_LOCALE, locale)
}

export function getLocalLocale() {
  return localStorage.getItem(KEY_SELECTED_LOCALE)
}
