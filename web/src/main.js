import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import './main.css'

import Login from './components/Login.vue'
import Home from './components/Home.vue'

import InfiniteLoading from 'vue-infinite-loading'

import { setToken } from './persist/account'
import { showError } from './util'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(InfiniteLoading)

Vue.config.productionTip = false

setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjY3OTk1MSwiaXNzIjoiaHR0cDovL2FwaS5nZXRzbG93bHkuY29tL2F1dGgvdWRpZC9yZWZyZXNoIiwiaWF0IjoxNTUyMzk3MDY4LCJleHAiOjE1NTMwMDE4NjgsIm5iZiI6MTU1MjM5NzA2OCwianRpIjoib1FzSTYwWlUyd2EzWXM4aCJ9.uSOgPWyvd2l57JlWu9_CNXI1crt3HZyqMkV8ppC62Og')
window.__CONFIG__ = {
  useCache: true
}

Vue.prototype.$errorHandler = function () {
  return ({ message }) => {
    showError(this, message)
    if (message == 'token_expired') {
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
  router
}).$mount('#app')
