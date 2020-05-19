import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_ROOT_API

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import Master from './views/Master'
import i18n from './i18n'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  let lang = to.params.lang

  if (!lang || (lang != process.env.VUE_APP_I18N_LOCALE && lang != process.env.VUE_APP_I18N_FALLBACK_LOCALE)) {
    lang = process.env.VUE_APP_I18N_LOCALE
    router.push({ path: lang+ '/404' })
  }

  i18n.locale = lang
  next()
})

Vue.use(VueRouter)

new Vue({
  render: h => h(Master),
  i18n,
  router
}).$mount('#app')
