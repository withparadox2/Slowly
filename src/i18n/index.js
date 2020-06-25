import Vue from "vue"
import VueI18n from "vue-i18n"

import en from "./locale/en.json"
import zhCN from "./locale/zh-CN.json"
import zhTW from "./locale/zh-TW.json"

const KEY_SELECTED_LOCALE = "local_select_locale"

const LOCALE_EN = "en"
const LOCALE_ZH_CN = "zh-CN"
const LOCALE_ZH_TW = "zh-TW"

const LOCALE_LIST = [
  {
    name: LOCALE_EN,
    text: "English",
    message: en,
  },
  {
    name: LOCALE_ZH_CN,
    text: "中文-简体",
    message: zhCN,
  },
  {
    name: LOCALE_ZH_TW,
    text: "中文-繁體",
    message: zhTW,
  },
]

const LOCALE_MAP = LOCALE_LIST.reduce(
  (map, item) => ((map[item.name] = item.message), map),
  {}
)

Vue.use(VueI18n)

function getPreferLang() {
  const localLocale = getLocalLocale()
  if (localLocale) {
    return localLocale
  }

  const navigatorLang =
    navigator && (navigator.language || navigator.userLanguage)

  if (navigatorLang & LOCALE_MAP[navigatorLang]) {
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

const i18n = new VueI18n({
  locale: getPreferLang(),
  messages: LOCALE_MAP,
})

export default i18n

export function getLocaleList() {
  return LOCALE_LIST
}

export function setLocalLocale(locale) {
  locale && localStorage.setItem(KEY_SELECTED_LOCALE, locale)
  i18n.locale = locale
}

export function getLocalLocale() {
  return localStorage.getItem(KEY_SELECTED_LOCALE)
}
