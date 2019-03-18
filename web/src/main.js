import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './main.css'

import Login from './components/Login.vue'
import Home from './components/Home.vue'

import InfiniteLoading from 'vue-infinite-loading'

import { setToken } from './persist/account'
import { showError } from './util'
import { store } from './store'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(InfiniteLoading)

Vue.config.productionTip = false

if (true) {
  let url = new URL(window.location.href)
  let token = url.searchParams.get("token")
  if (token) {
    setToken(token)
  }
}

window.__CONFIG__ = {
  useCache: false
}

Vue.prototype.$errorHandler = function () {
  return ({ message }) => {
    showError(this, message)
    if (message == 'token_expired' || message == 'token_invalid') {
      setToken('')
      this.$router.replace({
        name: 'login'
      })
    }
  }
}

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/home', name: 'home', component: Home },
  { path: '/', redirect: '/home' }
]

const router = new VueRouter({
  routes
})

new Vue({
  router, store
}).$mount('#app')
