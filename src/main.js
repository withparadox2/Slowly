import "./pollyfill"

import Vue from "vue"
import VueRouter from "vue-router"
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

import "./styles/main.styl"

import Login from "./pages/Login.vue"
import Home from "./pages/Home.vue"

import InfiniteLoading from "vue-infinite-loading"
import VueLazyload from "vue-lazyload"

import { setToken } from "./persist/account"
import { showError } from "./util"
import { store } from "./store"
import { redirectUrl } from "./update.js"
import i18n from "./i18n"

function updateMobileMode() {
  store.commit("setMobileMode", window.innerWidth <= 850)
}
updateMobileMode()
window.addEventListener("resize", updateMobileMode)

if (!redirectUrl()) {
  Vue.use(ElementUI)
  Vue.use(VueRouter)
  Vue.use(InfiniteLoading)
  Vue.use(VueLazyload)

  Vue.config.productionTip = false

  {
    let url = new URL(window.location.href)
    let token = url.searchParams && url.searchParams.get("token")
    if (token) {
      setToken(token)
    }
  }

  window.__CONFIG__ = {
    useCache: false,
  }

  Vue.prototype.$errorHandler = function({ message, exitLogin }) {
    showError(this, message)
    if (message == "token_expired" || message == "token_invalid" || exitLogin) {
      setToken("")
      this.$router.replace({
        name: "login",
      })
    }
  }

  const routes = [
    { path: "/login", name: "login", component: Login },
    { path: "/home", name: "home", component: Home },
    { path: "/", redirect: "/home" },
  ]

  const router = new VueRouter({
    routes,
  })

  new Vue({
    router,
    store,
    i18n,
  }).$mount("#app")
}
