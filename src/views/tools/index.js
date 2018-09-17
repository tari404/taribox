export default [
  {
    name: 'YYSColorful',
    path: 'yys-colorful',
    component: () => import(/* webpackChunkName: "tools" */ './YYSColorful.vue')
  },
  {
    name: 'Astar',
    path: 'astar',
    component: () => import(/* webpackChunkName: "tools" */ './Astar.vue')
  },
  {
    name: 'i18nTrans',
    path: 'i18n-trans',
    component: () => import(/* webpackChunkName: "tools" */ './I18nTrans.vue')
  }
]
