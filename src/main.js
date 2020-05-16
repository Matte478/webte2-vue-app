import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router'
import axios from 'axios'

// axios.defaults.baseURL = process.env.VUE_APP_ROOT_API
// axios.defaults.baseURL = 'http://127.0.0.1/api'
axios.defaults.baseURL = 'http://wt45.fei.stuba.sk:8045/final-api/api'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// import App from './App.vue'

import Master from './views/Master'

Vue.config.productionTip = false

Vue.use(VueRouter)

new Vue({
  render: h => h(Master),
  router,

}).$mount('#app')
