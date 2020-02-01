import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => {
      let height = window.screen.height
      let width = window.screen.width
      if (height <= width) {
        return import('@views/homepc/index.vue')
      } else {
        return import('@views/homephone/index.vue')
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
