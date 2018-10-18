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
  }
]
