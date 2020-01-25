import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 引入中文的语言包
dayjs.extend(relativeTime)

export default {
  // Vue.use(obj) => 会调用obj 中的install方法
  install (Vue) {
    // 自己封装的插件
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    // 封装一个休眠函数
    Vue.prototype.$sleep = sleep
    // 注册一个全局相对时间的过滤器
    Vue.filter('relTime', relTime)
  }
}

// 小技巧, 现在用户加载太快, 对服务器压力有点大,可以让用户的请求别那么快发出去,可以自己封装一个小休眠函数
// function(time = 500) 如果传time用传的 如果不传 用500
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time) // 表示 等待time时间之后 才能resolve
  })
}

// 相对时间的过滤器 得到一个相对时间
// value值我们认为就是时间
function relTime (value) {
  return dayjs().locale('zh-cn').from(value)
}
