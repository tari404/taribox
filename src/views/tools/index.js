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
  }
]
