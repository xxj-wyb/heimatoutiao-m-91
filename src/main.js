import Vue from 'vue'
import App from './App.vue'
import router from './permission' // 经过权限处理的router
import store from './store'
import Vant, { Lazyload } from 'vant' // 引入 vant组件库 用解构的方式引入 Lazyload 对象（懒加载）
import plugin from '@/utils/plugin'
import 'vant/lib/index.less' // 引入 vant 全部样式
import '@/styles/index.less' // 引入全局的自定义样式,因为要覆盖vant的样式，所以要放在vant样式文件下面
import 'amfe-flexible' // 引入自动适配插件
Vue.use(Vant) // 全局注册 :实际上调用了 Vant导出的对象的方法  即install方法; 一旦完成注册  在任意位置就可以使用 Vant组件库的组件
Vue.use(plugin) // 注册小插件 会调用插件中的install方法
Vue.use(Lazyload) // 完成懒加载对象的注册
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

// 黑马头条就是H5, H5就是运行在浏览器中的，只不过运行在 5+ Runtime这个增强版浏览器里面,浏览器和 APP的物理按钮并没有进行关联, 也就是 点击手机返回按钮, 浏览器并不会进行返回
// 对物理返回按键进行以下处理
// 在main.js中添加如下代码  此代码是采用的 5+ Runtime中的plus对象
document.addEventListener('plusready', function () {
  var webview = window.plus.webview.currentWebview()
  window.plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        webview.back()
      } else {
        // webview.close(); //hide,quit
        // plus.runtime.quit();
        // 首页返回键处理
        // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null
        window.plus.key.addEventListener('backbutton', function () {
          // 首次按键，提示‘再按一次退出应用’
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 1500) {
              window.plus.runtime.quit()
            }
          }
        }, false)
      }
    })
  })
})
