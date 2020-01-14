import Vue from 'vue'
import App from './App.vue'
import router from './permission' // 经过权限处理的router
import store from './store'
import Vant from 'vant' // 引入 vant组件库
import plugin from '@/utils/plugin'
import 'vant/lib/index.less' // 引入 vant 全部样式
import '@/styles/index.less' // 引入全局的自定义样式,因为要覆盖vant的样式，所以要放在vant样式文件下面
import 'amfe-flexible' // 引入自动适配插件
Vue.use(Vant) // 全局注册 :实际上调用了 Vant导出的对象的方法  即install方法; 一旦完成注册  在任意位置就可以使用 Vant组件库的组件
Vue.use(plugin) // 注册小插件 会调用插件中的install方法
// 在vant注册后，this.$notify能够调用到 方法 => 是因为 Vue.proptotpe.$notify挂载了一个提示方法
// 修改 $notify 中 duration的默认值； 调用原来的方法，重新赋值
// Vue.proptotpe.$gnotify = (params) => Vue.proptotpe.$notify({ duration: 1000, ...params }) // ...pramas扩展运算符：对象中的扩展运算符(...)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中
// 把这个修改的方法 封装到@/utils/plugin，以便后面随时调用，这个页面需要全局注册

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
