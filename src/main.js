import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant' // 引入 vant组件库
import 'vant/lib/index.css' // 引入 vant 样式文件
Vue.use(Vant) // 全局注册 :实际上调用了 Vant导出的对象的方法  即install方法; 一旦完成注册  在任意位置就可以使用 Vant组件库的组件

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
