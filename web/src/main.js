import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import Login from './components/Login.vue'

Vue.use(ElementUI);
Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' }
]

const router = new VueRouter({
  routes
})

new Vue({
  router
}).$mount('#app')
