// 路由文件
import Vue from 'vue'
import VueRouter from 'vue-router'
// 按需导入 const 组件名= ()=> import('文件地址')
const Layout = () => import('@/views/layout') // 布局组件
const Home = () => import('@/views/home') // 主页组件
const Question = () => import('@/views/question') // 问答组件
const Video = () => import('@/views/video') // 视频组件
const User = () => import('@/views/user') // 个人中心
const Profile = () => import('@/views/user/profile') // 编辑资料
const Chat = () => import('@/views/user/chat') // 小智同学
const Login = () => import('@/views/login') // 登录组件
const Article = () => import('@/views/article') // 文章详情
const Search = () => import('@/views/search') // 搜索中心
const SearchResult = () => import('@/views/search/result') // 搜索结果

Vue.use(VueRouter)

// 一般来说 不会将所有的组件进行缓存 只会挑几个交互需要的组件
// 可以在路由表 给 layout组件 一个标识 也就是 路由元信息`,meta
// meta 属性 是route信息里面的一个属性 我们可以在这里存放一些数据 在路由切换的时候使用
const routes = [
  {
    path: '/',
    name: 'home',
    component: Layout, // 一级路由
    children: [
      // 这里放  二级路由
      {
        path: '/', // 由于一级路由下存在二级路由 并且path相同 所以meta放在二级路由下
        component: Home,
        // meta 属性生存在 二级路由并且path相同的情况下 需要写到二级路由下
        meta: {
          isAlive: true // 是否缓存组件实例
        }
      },
      { path: '/question', component: Question },
      { path: '/video', component: Video },
      { path: '/user', component: User }
    ]
  },
  { path: '/user/profile', component: Profile },
  { path: '/user/chat', component: Chat },
  { path: '/login', component: Login },
  { path: '/article', component: Article },
  { path: '/search', component: Search },
  { path: '/search/result', component: SearchResult }
]

const router = new VueRouter({
  routes
})

export default router
