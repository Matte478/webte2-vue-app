import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router'

// import App from './App.vue'

import Master from './views/Master'

Vue.config.productionTip = false

Vue.use(VueRouter)

new Vue({
  render: h => h(Master),
  router,
  
}).$mount('#app')
