import Vue from 'vue'
import App from './App.vue'
import router from './permission' // 经过权限处理的router
import store from './store'
import Vant from 'vant' // 引入 vant组件库
import 'vant/lib/index.css' // 引入 vant 样式文件
import '@/styles/index.less' // 引入全局的自定义样式,因为要覆盖vant的样式，所以要放在vant样式文件下面
import 'amfe-flexible' // 引入自动适配插件
Vue.use(Vant) // 全局注册 :实际上调用了 Vant导出的对象的方法  即install方法; 一旦完成注册  在任意位置就可以使用 Vant组件库的组件

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
