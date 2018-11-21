import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import catalog from '@/views/tools/index.js'
import gameCatalog from '@/views/games/index.js'
import Tools from '@/views/Tools'
import Games from '@/views/Games'

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
    },
    {
      path: '/games',
      name: 'Games',
      component: Games,
      children: Array.prototype.map.call(gameCatalog, item => {
        return {
          path: item.path,
          name: item.name,
          component: item.component
        }
      })
    },
    {
      path: '/whiteboard',
      name: 'Whiteboard',
      component: () => import('@/views/Whiteboard')
    }
  ]
})
