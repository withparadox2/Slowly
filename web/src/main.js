import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import './main.css'

import Login from './components/Login.vue'
import Home from './components/Home.vue'

import { setToken } from './persist/account'
import { showError } from './util'

Vue.use(ElementUI);
Vue.use(VueRouter)

Vue.config.productionTip = false
setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjY3OTk1MSwiaXNzIjoiaHR0cDovL2FwaS5nZXRzbG93bHkuY29tL2F1dGgvc29jaWFsIiwiaWF0IjoxNTUxNzc0MjIxLCJleHAiOjE1NTIzNzkwMjEsIm5iZiI6MTU1MTc3NDIyMSwianRpIjoiSzBCV2szcHREdklRcjhGdiJ9.eqEiMLl6FoSLVawRyw2rjYjB21L1RLqPebfhApts61A')

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
