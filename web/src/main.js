import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import Login from './components/Login.vue'
import FriendList from './components/FriendList.vue'

import { setToken } from './http'

Vue.use(ElementUI);
Vue.use(VueRouter)

Vue.config.productionTip = false
setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjY3OTk1MSwiaXNzIjoiaHR0cDovL2FwaS5nZXRzbG93bHkuY29tL2F1dGgvc29jaWFsIiwiaWF0IjoxNTUxNzc0MjIxLCJleHAiOjE1NTIzNzkwMjEsIm5iZiI6MTU1MTc3NDIyMSwianRpIjoiSzBCV2szcHREdklRcjhGdiJ9.eqEiMLl6FoSLVawRyw2rjYjB21L1RLqPebfhApts61A')

const routes = [
  { path: '/login', component: Login },
  { path: '/friends', component: FriendList },
  { path: '/', redirect: '/friends' }
]

const router = new VueRouter({
  routes
})

new Vue({
  router
}).$mount('#app')
