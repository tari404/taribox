export default [
  {
    name: 'Dino',
    path: 'dino',
    component: () => import(/* webpackChunkName: "games" */ './Dino.vue')
  }
]
