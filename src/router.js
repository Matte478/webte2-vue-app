import VueRouter from 'vue-router'

// Pages
import Home from './views/Home'
import PageNotFound from './views/404'


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },

  
  {
    path: '*',
    name: 'page-not-found',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
})

export default router