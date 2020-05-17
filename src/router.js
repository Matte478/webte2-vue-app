import VueRouter from 'vue-router'
import i18n from './i18n'

// Pages
import Home from './views/Home'
import PageNotFound from './views/404'


const routes = [
  {
    path: '/',
    redirect: `/${i18n.locale}`
  },
  {
    path: '/:lang',
    component: {
      render(c) {
        return c('router-view')
      }
    },
    children: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: 'test',
        name: 'test',
        component: Home
      }
    ]
  },

  // {
  //   path: '/blablabla',
  //   name: 'test2',
  //   component: Home
  // },

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