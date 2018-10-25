export default [
  {
    name: 'Dino',
    path: 'dino',
    component: () => import(/* webpackChunkName: "games" */ './Dino.vue')
  },
  {
    name: 'Snake',
    path: 'snake',
    component: () => import(/* webpackChunkName: "games" */ './Snake.vue')
  },
  {
    name: 'Tar',
    path: 'tar',
    component: () => import(/* webpackChunkName: "live2d" */ './Tar.vue')
  }
]
