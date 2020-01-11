// 专门处理用户信息的存储和删除 以及获取并放置在 localStorge
// 设置一个key,这个key专门用来存储 用户信息
const USER_TOKEN = 'heima-toutiao-m-91-token'

// 设置用户信息 要转为字符串
export function setUser (user) {
  localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 读取用户信息 要转为对象
export function getUser () {
  return JSON.parse(localStorage.getItem(USER_TOKEN) || '{}') // 短路表达式：以防获取为空时报错
}

// 删除用户信息
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
