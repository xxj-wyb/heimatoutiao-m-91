// 这里 封装request模块
// 为什么封装 ？  因为要在拦截器处理 token统一注入，响应数据的统一处理返回，处理最大数字
// token失效
import axios from 'axios' // 引入axios插件
import JSONBig from 'json-bigint' // 处理大数字插件
import store from '@/store' // 引入vuex中的store实例
import router from '@/router' // 引入路由对象实例
// 创建一个新的axios实例， 和原来的axios没有关系了 导出别人才能使用
// 应该给request请求 一个默认的请求头  baseURL
const instance = axios.create({
  // 构造参数
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 设置公共请求地址
  // 处理大数字
  transformResponse: [function (data) {
    // data就是后端响应的字符串,默认的转化是 JSON.parse,处理大数字是有问题的,需要用JSONBIG替换
    // return data ? JSONBig.parse(data) : {}  判断data是否存在，存在就JSONBig.parse转化，不存在就返回一个空对象
    // 第二种方法，用try捕捉错误
    try {
      return JSONBig.parse(data) // 先尝试转化， 如果失败 就把字符串直接返回
    } catch (error) {
      return data
    }
  }]
})
// 在请求拦截器注入token
// 1.请求拦截器 => 发起请求 => 请求拦截器  => 服务器  => 统一注入token
instance.interceptors.request.use(function (config) {
  // config就是请求的参数  store.state.user里面携带token
  if (store.state.user.token) {
    // 如果token存在 就要统一注入
    config.headers['Authorization'] = `Bearer ${store.state.user.token}`
  }
  // 配置信息
  return config
}, function (error) {
  // 返回失败 没有获取到token
  return Promise.reject(error)
})

// 响应拦截器 => 服务器  =>  响应拦截器   => then  await
instance.interceptors.response.use(function (response) {
  // 返回得到的response, 第一层data是axios默认包data, 第二个data是接口返回里面的包的data
  try {
    // 响应成功，将数据解构
    return response.data.data
  } catch (error) {
    return response.data
  }
}, async function (error) {
  // 错误的时候 token容易失效  处理token失效的问题
  // 如何判断失效  401
  // error  => config (当前请求 的配置) request(请求) response(响应)
  if (error.response && error.response.status === 401) {
    // router除了push一个字符串,还可以push一个对象
    // router.push({ path: '/login', query: { redirectUrl: path } })
    // router.currentRoute.path当前页面现在没有权限，登录以后有权限了就可以访问了，所以要把这个地址传给登录页面
    // 将path换成fullPath这个完整地址，携带id的，可以防止退出再登录后地址id的问题
    let toPath = { path: '/login', query: { redirectUrl: router.currentRoute.fullPath } } // 定义首页跳转对象
    //  表示token过期 先判断 是否有refresh_token,这是续命的标志
    if (store.state.user.refresh_token) {
      try {
        // 发送一个请求 换取新的token
        // 这里不应该再用instance  因为 instance会再次进入拦截器，获取到失效的token  用原有的axios
        let result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })
        // 把获取的新数据调用 updateUser 方法，更改user用户信息
        store.commit('updateUser', {
          user: {
            token: result.data.data.token, // 拿到新的token之后，更新到本地
            refresh_token: store.state.user.refresh_token // refresh_token有14天有效期，给保存起来
          }
        })// 更新vuex的数据 也更新了本地缓存数据
        // 此时再用instance是因为已经获取到了新的token，可以再次进入到拦截器了
        return instance(error.config) // config(当前请求 的配置), 把刚才401错误的请求再次发送出去 然后将promise返回,result就是返回结果
      } catch (error) {
        //  如果错误 表示补救措施也没用了 应该跳转到登录页 并且 把废掉的user全都干掉
        store.commit('clearUser') // 所有的用户信息清空
        router.push(toPath) // 跳转到登录页
      }
    } else {
      // 连refresh_token 都没有 跳转到登录页面
      router.push(toPath)
    }
  }
  return Promise.reject(error)
})
export default instance
