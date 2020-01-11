// postcss.config.js 只会在编译时起作用
module.exports = {
  plugins: {
    'autoprefixer': {},
    'postcss-pxtorem': {
      rootValue: 37.5, // rem基准：因为我们做的是手机 手机以iphone6为主要适配 375 取十分之一
      propList: ['*']
    }
  }
}
// 更改了配置，要重新启动服务器
