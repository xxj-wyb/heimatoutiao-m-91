// webpack的配置文件 都在这里
module.exports = {
  // 覆盖蓝色主题
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  },
  configureWebpack: (config) => {
    // 这个config参数就是当前 vue-cli 项目的所有的webpack配置信息
    // 如果想要改动，直接改正信息就可以
    // 判断下当前的环境 是否是 生产环境
    if (process.env.NODE_ENV === 'production') {
      // webpack 会在生产模式下运行
      // 把所有的console都删除掉，然后再打包
      // 这里的删除不是删除源代码中所有的console，而是删除打包出来的console
      // drop_console  这个意思是删除所有的console  为true 表示删除所有的 console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  // 只有在http web服务中才可以通过 /来访问,这时我们并没有启动http服务, 所以我们可以把 / 换成./
  // ./ 可以被文件系统访问识别 因此可以访问index.html了
  publicPath: './' // 默认是 / => 改成 ./
}
// 改了配置文件后，重新启动服务
