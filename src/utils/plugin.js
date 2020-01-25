export default {
  // Vue.use(obj) => 会调用obj 中的install方法
  install (Vue) {
    // 自己封装的插件
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    // 封装一个休眠函数
    Vue.prototype.$sleep = sleep
  }
}

// 小技巧, 现在用户加载太快, 对服务器压力有点大,可以让用户的请求别那么快发出去,可以自己封装一个小休眠函数
// function(time = 500) 如果传time用传的 如果不传 用500
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time) // 表示 等待time时间之后 才能resolve
  })
}
