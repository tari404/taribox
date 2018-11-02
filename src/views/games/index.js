export default [
  {
    name: 'Dino',
    path: 'dino',
    title: 'Chrome小恐龙跳',
    intro: `帮社团朋友写的考核题目参考，素材都是来自于Chrome的。因为是作为考核题目的基础所以只做了最最简单的跳跃，不过备注倒是写的非常充足。`,
    component: () => import(/* webpackChunkName: "games" */ './Dino.vue')
  },
  {
    name: 'Snake',
    path: 'snake',
    title: '贪吃蛇',
    intro: `一时大脑停止思考的产物，即没有什么好点子也没有继续往下做的想法就凉在这了。（甚至没有做游戏最关键的食物XD）`,
    component: () => import(/* webpackChunkName: "games" */ './Snake.vue')
  },
  {
    name: 'Tar',
    path: 'tar',
    title: '是会动的站娘哒呦～',
    intro: `超可爱`,
    component: () => import(/* webpackChunkName: "live2d" */ './Tar.vue')
  }
]
