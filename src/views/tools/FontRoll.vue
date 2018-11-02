<template>
  <div id="font-roll-box">
    <div>{{funcStr}}</div>
    <p>在浏览器上执行这段代码，可以让整个页面的文字翻滚起来（可能会有一定卡顿，但是绝对安全）</p>
    <div id="font-roll-button">
      <div @click="click" :class="{ 'clicked': clicked }">试一试</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FontRoll',
  data () {
    return {
      clicked: false,
      // eslint-disable-next-line
      funcStr: "eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p;}('p 5(2){6 a=2.Z;b(a.C===0||2.4===\\'D\\'||2.4===\\'B\\'||2.4===\\'z\\'||2.4===\\'A\\'){h}6 5=[];a.8(9=>{b(9.4===\\'#3\\'){5.E(9)}});5.8(o)}p o(3){6 t=3.I;b(!/\\\\S/.J(t)){h}H.F.8.G(t,c=>{6 d=7.l(\\'w\\');d.v=c===\\' \\'?\\' \\':c;d.y=\\'e-k-j-g-i\\';d.f.x=`q(${r.u()*K-12}13)`;3.14(d)});3.Y()}18 s=7.l(\\'f\\');s.19(\\'1a\\',\\'3/16\\');s.n(`.e-k-j-g-i{17:11-P!1;Q:0!1;M:0!1;V:m!1;W-X:m!1;R:T!1;U:O!1;N:L!1}`);7.15(\\'*\\').8(5);7.10.n(s)',62,73,'|important|node|text|nodeName|update|const|document|forEach|child|childs|if|||b260bb9f|style|93d1|return|9af5967b3e04|44c5|3635|createElement|inherit|append|updateChar|function|rotate|Math|||random|innerHTML|span|transform|className|TITLE|HEAD|SCRIPT|length|STYLE|push|prototype|call|Array|nodeValue|test|24|auto|padding|width|relative|block|margin|float||none|position|color|font|size|remove|childNodes|body|inline||deg|before|querySelectorAll|css|display|var|setAttribute|type'.split('|'),0,{}))"
    }
  },
  methods: {
    click () {
      if (this.clicked) {
        return
      }
      this.clicked = true
      // eslint-disable-next-line
      eval(this.funcStr)
    }
  }
}
</script>

<style lang="stylus" scoped>
#font-roll-box
  text-align left
  font-size 12px
  width 80%
  min-width 300px
  max-width 700px
  word-break break-all
  margin auto
#font-roll-button
  margin 20px auto 0
  width 240px
  height 40px
  border-radius 6px
  background-color #999
  div
    font-size 14px
    color #666
    line-height 38px
    text-align center
    width 100%
    height 100%
    border solid 1px #999
    border-radius 6px
    box-sizing border-box
    transform translateY(-8px)
    cursor pointer
    background-color #fff
    transition transform .2s, background-color .2s
    &:hover
      transform translateY(-6px)
  .clicked
    transform translateY(0px)
    background-color #f0f0f0
    &:hover
      transform translateY(0px)
</style>
