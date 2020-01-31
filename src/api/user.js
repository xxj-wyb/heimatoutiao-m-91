// 这里封装  用户登录相关的 请求模块
import request from '@/utils/request' // 引入封装的 request 模块

// 登录方法
// query参数 =>放到 axios  => params参数里； body 参数  => axios => data参数里
export function login (data) {
  // 得到一个promise对象  返回
  return request({
    url: '/authorizations',
    data,
    method: 'post'
  })
}

// 封装 关注用户API
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}

// 封装 取消关注API target：是路径参数 拼接在地址栏中
export function unFollowUser (target) {
  return request({
    url: `/user/followings/${target}`,
    method: 'delete'
  })
}

// 封装 获取用户自己信息API
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
