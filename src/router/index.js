/* eslint-disable import/no-cycle */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// eslint-disable-next-line import/no-cycle
import MenuVertical from './routes/menu'
import Rutas from './routes/rutas'

Vue.use(VueRouter)

export function authGuard(to, from, next) {
  store.dispatch('auth/me')
  let isAuthenticated = false
  if (localStorage.getItem('token')) { isAuthenticated = true } else { isAuthenticated = false }
  if (isAuthenticated) {
    next() // allow to enter route
  } else {
    next('/login') // go to '/login';
  }
}
export function beforeAuthGuard(to, from, next) {
  let isAuthenticated = false
  if (localStorage.getItem('token')) { isAuthenticated = true } else { isAuthenticated = false }
  if (!isAuthenticated) {
    next()
  } else {
    next('/')
  }
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home/Home.vue'),
      beforeEnter: authGuard,
    },
    ...MenuVertical,
    ...Rutas,
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Home/Login.vue'),
      beforeEnter: beforeAuthGuard,
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      name: 'error-404',
      component: () => import('@/views/Home/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
