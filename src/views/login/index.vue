<template>
  <!-- 登录页面 -->
  <div class="container">
    <!-- left-arrow:是否显示左侧箭头 -->
    <!-- @blur 输入框失去焦点时触发的事件 -->
    <van-nav-bar left-arrow title="登录" @click-left="$router.back()"></van-nav-bar>
    <!-- 登录的基础布局：手机号  验证码  登录按钮 -->
    <van-cell-group>
      <!-- error-message 属性显示对应的错误提示 -->
      <van-field
        @blur="checkMobile"
        :error-message="errMsg.mobile"
        v-model="loginForm.mobile"
        label="手机号"
        placeholder="请输入手机号"
      ></van-field>
      <van-field
        @blur="checkCode"
        :error-message="errMsg.code"
        v-model="loginForm.code"
        label="验证码"
        placeholder="请输入验证码"
      >
        <!-- slot指定给哪个坑填内容 -->
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <van-cell-group>
      <div class="btn-box">
        <!-- info是蓝色  round 圆角  block 是否为块级元素-->
        <van-button @click="login" type="info" size="small" round block>登录</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      // 专门提示信息的,需要动态绑定
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    checkMobile () {
      // 判断手机号是否为空  并且判断格式是否正确
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '手机号不能为空'
        return false
      }
      // 判断格式是否正确
      // test() 方法用于检测一个字符串是否匹配某个模式. 是则返回true，否则返回false
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机格式不正确'
        return false
      }
      // 当没有问题时，要清空提示的错误信息
      this.errMsg.mobile = ''
      return true
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errMsg.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码必须为6位数字'
        return false
      }
      // 当没有问题时，要清空提示的错误信息
      this.errMsg.code = ''
      return true
    },
    // 登录方法
    login () {
      if (this.checkMobile() && this.checkCode()) {
        // 手机号和验证码都通过了 表示前端校验通过, 此时还要调用接口
        // 提示消息 表示登录成功
        console.log('校验通过')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  padding: 10px;
}
</style>
