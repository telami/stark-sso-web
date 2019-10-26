import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/login.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/about.vue')
    },
    {
      path: '/redirect',
      name: 'redirect',
      component: () => import('../views/redirect.vue')
    },
    {
      path: '/relate',
      name: 'relate',
      component: () => import('../views/relate.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register.vue')
    },
    {
      path: '/registerResult',
      name: 'registerResult',
      component: () => import('../views/register-result.vue')
    }
  ]
})
