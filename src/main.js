//该文件是整个项目的入口
//引入vue
import Vue from 'vue'
//引入APP组件
import App from './App.vue'
import store from './store'
//引入路由器
import VueRouter from 'vue-router'
import router from './router'
//引入elementUI组件库 完整引入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/theme/index.css'
//剪贴板功能
import VueClipboard from 'vue-clipboard2'
//关闭vue的生产提示
Vue.config.productionTip = false
//应用路由
Vue.use(VueRouter)
//应用组件库
Vue.use(ElementUI)
//应用剪贴板
Vue.use(VueClipboard)

new Vue({
  el:'#app',
  render: h => h(App),
  router:router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
})
