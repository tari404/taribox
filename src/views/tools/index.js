export default [
  {
    name: 'YYSColorful',
    path: 'yys-colorful',
    title: '阴阳师彩虹色聊天助手',
    intro: `手游《阴阳师》聊天助手：可以生成游戏内聊天功能的支持的彩虹渐变色字。不过官方好像对此不置可否，仅供参考。`,
    component: () => import(/* webpackChunkName: "tools" */ './YYSColorful.vue')
  },
  {
    name: 'Astar',
    path: 'astar',
    title: 'A*寻路算法的尝试demo',
    intro: '闲暇时间做的A*算法的可视化实现，可以调节多种参数并且分步演示。',
    component: () => import(/* webpackChunkName: "tools" */ './Astar.vue')
  },
  {
    name: 'FontRoll',
    path: 'fontroll',
    title: '文字翻滚脚本',
    intro: '可以让页面中的文字翻滚！',
    component: () => import(/* webpackChunkName: "tools" */ './FontRoll.vue')
  },
  {
    name: 'Fourier',
    path: 'fourier',
    title: '傅立叶变化演示',
    intro: '3Blue1Brown频道提供的超好理解的图形化解释，正在尝试在前端进行可交互的复现。',
    component: () => import(/* webpackChunkName: "math" */ './Fourier.vue')
  },
  {
    name: 'Three',
    path: 'three',
    title: 'Three.js研究',
    intro: '正在用于研究three.js及webgl的空白页面。',
    component: () => import(/* webpackChunkName: "webgl" */ './Three.vue')
  },
  {
    name: 'i18nTrans',
    path: 'i18n-trans',
    title: 'i18n的JSON文件翻译助手',
    intro: '做前端多语言时可以把文本放在一个.json文件里交给翻译去翻，提供了一个简单的解析和保存的可视化页面。',
    component: () => import(/* webpackChunkName: "tools" */ './I18nTrans.vue')
  }
]
