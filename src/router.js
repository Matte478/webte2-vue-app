import VueRouter from 'vue-router'
import i18n from './i18n'

// Pages
import Home from './views/Home'
import Airplane from './views/Airplane'
import PageNotFound from './views/404'
import Pendulum from './views/Pendulum'
import Ballbeam from './views/Ballbeam'
import Suspension from './views/Suspension'
import Statistics from './views/Statistics'
import Team from './views/Team'
import Api from './views/Api'
import Documentation from './views/Documentation'


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
        path: 'airplane',
        name: 'airplane',
        component: Airplane
      },
      {
        path: 'pendulum',
        name: 'pendulum',
        component: Pendulum
      },
      {
        path: 'ballbeam',
        name: 'ballbeam',
        component: Ballbeam
      },
      {
        path: 'suspension',
        name: 'suspension',
        component: Suspension
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: Statistics
      },
      {
        path: 'team',
        name: 'team',
        component: Team
      },
      {
        path: 'api',
        name: 'api',
        component: Api
      },
      {
        path: 'documentation',
        name: 'documentation',
        component: Documentation
      },
      {
        path: '404',
        name: 'page-not-found',
        component: PageNotFound
      },
      {
        path: '*',
        // name: 'page-not-found',
        component: PageNotFound
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
})

export default router