export default {
  // Vue.use(obj) => 会调用obj 中的install方法
  install (Vue) {
    // 自己封装的插件
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}
