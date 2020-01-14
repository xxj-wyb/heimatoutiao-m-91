// 这里封装  用户登录相关的 请求模块
import request from '@/utils/request' // 引入封装的 request 模块

// query参数 =>放到 axios  => params参数里； body 参数  => axios => data参数里
export function login (data) {
  // 得到一个promise对象  返回
  return request({
    url: '/authorizations',
    data,
    method: 'post'
  })
}
