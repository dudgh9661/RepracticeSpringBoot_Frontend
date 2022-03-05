import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import { BootstrapVue, IconsPlugin, VBHoverPlugin, NavbarPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueSimpleAlert from 'vue-simple-alert'
import utils from './utils/utils.js'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VBHoverPlugin)
Vue.use(VueSimpleAlert)
Vue.use(NavbarPlugin)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$utils = utils
Vue.prototype.$eventBus = new Vue() // eventBus
Vue.prototype.$url = 'http://3.37.212.153:8080'
Vue.prototype.$ip = ''
if (window.location.hostname === 'localhost') {
  Vue.prototype.$url = 'http://localhost:8080'
}
axios.get('https://api.ipify.org?format=json').then(
      (res) => {
        Vue.prototype.$ip = res.data.ip
        console.log('main.js ::: ', Vue.prototype.$ip)
        // console.log('접속한 IP : ' + this.prototype.$ip)
        new Vue({
          router,
          render: h => h(App)
        }).$mount('#app')
      }
).catch(err => console.error('ip error : ', err))

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')