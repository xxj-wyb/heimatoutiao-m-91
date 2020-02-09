// 状态文件
import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth' // 后面直接用auth.方法调用里面的信息

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 放置数据的地方
    // 初始化的时候直接将用户信息给公共状态: 即一进入页面 ,一初始化Vuex就需要读取token user里面有token
    user: auth.getUser(),
    photo: null // 用户头像 把头像作为公共的数据进行状态共享，这样在聊天页,就可以轻而易举的获得用户的头像了
  },
  mutations: {
    // state数据修改必须通过mutations
    // payload 载荷中携带 user
    updateUser (state, payload) {
      state.user = payload.user // 更新数据,此时缓存中的数据还没有改变
      auth.setUser(payload.user) // 将数据同步设置到本地存储中
    },

    // 清空User  此时不需要载荷了
    clearUser (state) {
      state.user = {}
      auth.delUser() // 将缓存中的数据也清空
    },

    //  更新用户头像的方法 载荷 携带参数用的
    updatePhoto (state, payload) {
      state.photo = payload.photo // 将载荷里面的数据设置给state
    }
  },
  actions: {
  },
  modules: {
  }
})
