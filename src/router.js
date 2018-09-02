import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import catalog from '@/views/tools'
import Tools from '@/views/Tools'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tools',
      name: 'Tools',
      component: Tools,
      children: Array.prototype.map.call(catalog, item => {
        return {
          path: item.path,
          name: item.name,
          component: item.component
        }
      })
    }
  ]
})
