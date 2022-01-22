import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import { BootstrapVue, IconsPlugin, VBHoverPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueSimpleAlert from 'vue-simple-alert'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VBHoverPlugin)
Vue.use(VueSimpleAlert)
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')