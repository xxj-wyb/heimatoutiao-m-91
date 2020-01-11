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

const routes = [
  {
    path: '/',
    name: 'home',
    component: Layout, // 一级路由
    children: [
      // 这里放  二级路由
      { path: '/', component: Home },
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
