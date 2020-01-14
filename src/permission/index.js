// 路由的拦截  => 导航守卫
// 确定要拦截的页面 /user 个人中心  /user/chat    /user/profile
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入store

// 前置守卫 => 当你的路由发生改变之前触发
// 三个参数：
// to 到哪里去； from 从哪里来
// next 函数 => 必须有 next() => resolve 这个钩子  => 前面不执行next  => 后面永远不执行
// next(false)： 终止当前的跳转 ； next(地址)：跳到另外一个地址； next() 放行
router.beforeEach(function (to, from, next) {
  // 拦截：判断文件是否是以user开头的，并且判断有无token  有token => 放行; 没有token => 登录
  // startsWith 以xx开头
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 记录当前地址
    let toPath = {
      path: '/login',
      query: {
        // redirectUrl：把要去的地址传到到登录页(现在这个地址还没有权限访问) => 登录成功之后，有了权限 再回到刚才没有权限去的地址
        redirectUrl: to.path
      }
    }
    next(toPath)
  } else {
    next() // 直接放行
  }
})

export default router
