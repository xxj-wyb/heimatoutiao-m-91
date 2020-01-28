// 专门处理频道的请求
import request from '@/utils/request'
import store from '@/store'

/* 重构我的频道API
  1、游客和用户第一次会查询到默认的频道,我们将这个默认频道 缓存到本地,如果要修改 就可以修改本地的这个缓存
  2、以后再次进来 ,就从缓存中先读取,如果 能读到,就用本地的,否则查询线上频道
  3、读取缓存数据的时候还需要 区分 游客和登录
*/

// 本地缓存 需要key
const CACHE_CHANNEL_T = 'hm-91-toutiao-t' // 游客缓存的key
const CACHE_CHANNEL_U = 'hm-91-toutiao-u' // 登录用户的key

// 获取我的频道
export function getMyChannels () {
  // 返回一个Promise  axios默认就是get类型
  // 首先我们应该 先从缓存中读取 看看缓存中有没有 如果缓存中有的话 用缓存的数据 如果缓存中没有 才去线上查询
  // return request({
  //   url: '/user/channels'
  // })  在index.vue中 调用获取频道接口，返回的是Promise，所以这里也要返回一个Promise，否则得到的只是线上频道

  return new Promise(async function (resolve, reject) {
    // 做我们的逻辑
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T // 用于缓存的key
    // 从缓存中读取数据
    let str = localStorage.getItem(key) // 得到缓存结果
    if (str) {
      //  如果str存在 表示缓存中有数据
      resolve({ channels: JSON.parse(str) }) // 表示从缓存中获取的数据 通过执行链下发给下一个promise
    } else {
      // 如果没有数据 则查询线上频道
      const data = await request({ url: '/user/channels' }) // 从线上拉取数据
      localStorage.setItem(key, JSON.stringify(data.channels)) // 将线上数据写入缓存 要转为字符串
      resolve(data) // 将线上获取的数据释放下给promise
    }
  })
}

// 获取所有频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
