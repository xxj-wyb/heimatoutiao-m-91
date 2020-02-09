<template>
  <!-- 小智同学组件 -->
  <div class="container">
      <!-- left-arrow:是否显示左侧箭头 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="myList">
      <!-- list的数据分两种 一种是小智同学说的 一种是用户自己说的 -->
      <!-- 这个div 要展示两种场景 小智的场景 左边  我的场景 右边 -->
      <!-- 根据当前 name的值 决定 样式 是left 还是right  -->
      <!-- v-bind绑定class的对象语法  当前的样式left还是right -->
      <div :class="{ left: item.name === 'xz', right: item.name!='xz' }" class="chat-item" v-for="(item,index) in list" :key="index">
        <!-- 小智同学的图片 -->
        <!-- 需要根据item中的name值 决定是否显示 左侧的图片 或者右侧的图片 -->
        <van-image v-if="item.name === 'xz'" fit="cover" round :src="XZImg" />
        <div class="chat-pao">{{ item.msg }}</div>
        <!-- 右边再放置一个图片 -->
        <van-image v-if="item.name !== 'xz'" fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao"></div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <!-- loading: 进度条的目的是 控制用户输入内容的频率 -->
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import XZImg from '@/assets/images/xz.png' // 引入 小智头像的地址
import { mapState } from 'vuex' // 引入辅助函数
import io from 'socket.io-client' // 引入 socket.io 的客户端代码
export default {
  name: 'chat',
  data () {
    return {
      value: '', // 用来绑定用户的谈话内容
      loading: false,
      XZImg, // es6语法 XZImg:XZImg
      list: [] // 存储 两个人聊天的内容
    }
  },
  methods: {
    // 滚动到底部
    scrollBottom () {
      // 需要通过获取滚动条高度 和设置滚动条距离来滚动
      // 滚动条的位置是通过什么属性控制的？ => scrollTop:滚动条位置距离顶部距离
      // 需要将位置设置到 滚动到底部
      // scrollTop 获取元素滚动出去的距离  scrollHeight：获取元素的高度
      // $nextTick 会在上一次数据更新 并且视图完成渲染之后执行
      this.$nextTick(() => {
        // 可以保证 在滚动的时候 视图已经更新完毕
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight // 滚到底部
      })
    },
    async send () {
      // 发送消息时  需要做些什么
      // 1.获取要发送的内容
      if (!this.value) return false // 如果为空白字符串 就直接返回 不继续下去了
      this.loading = true // 先打开加载状态
      // 设置一下时间间隔
      await this.$sleep() // 默认时间是500毫秒
      // 聊天内容不为空 就继续发送
      // emit 发送消息；  on 接收消息
      let obj = {
        msg: this.value, // 消息内容
        timestamp: Date.now() // 时间戳，直接给当前的时间戳
      }
      // 发送消息
      this.socket.emit('message', obj)
      // 把消息添加到 消息列表中
      this.list.push(obj)
      // 清空输入框内容
      this.value = ''
      this.loading = false // 恢复状态
      this.scrollBottom() // 消息发送完之后  设置滚动条距离 滚动到底部
    }
  },
  computed: {
    ...mapState(['photo', 'user']) // 映射vuex中的公共变量
  },

  // 实例创建完毕之后执行的函数
  created () {
    // 建立和websocket和服务器的连接
    // 原生方式  new WebSocket()
    // 封装的socket.io
    // io(连接地址, { 额外参数 })  额外参数 可以看后台给的数据
    this.socket = io('http://ttapi.research.itcast.cn', {
      // query参数
      query: {
        token: this.user.token // 从vuex中获取用户的token
      }
    }) // 用this.socket 接收了一个socketIO的实例对象
    // 通过socketIO对象 监听事件=> 接收消息
    this.socket.on('connect', () => {
      console.log('和服务器建立连接成功!!!')
      // 先让小智同学和用户说一句话 模拟说话
      this.list.push({ msg: '快睡吧，熬夜会变丑', name: 'xz' }) // name:xz 表示这句话是小智同学说的
    })
    //  如何知道建立连接成功
    // 需要监听 小智同学回复的消息 回复的参数就是body请求的参数，在data上
    // data中包含msg (小智同学回复的内容)、timestmp (小智同学回复的时间戳)
    // 这个位置 只有小智同学回复的时候才会调用
    this.socket.on('message', (data) => {
      this.list.push({ ...data, name: 'xz' }) // ...data:使用延展运算符合并数据
      // name:xz相当于 给我们的消息记录一下 谁发了这个消息
      this.scrollBottom() // 接收消息也要 设置滚动距离 滚动到底部
    })
  },
  // 退出页面之前,我们要将连接关闭
  // beforeDestroy => 钩子函数  =>  在页面销毁之前触发
  beforeDestroy () {
    // 销毁连接
    this.socket.close()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
