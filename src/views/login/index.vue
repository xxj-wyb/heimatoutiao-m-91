<template>
<!-- 登录页面 -->
  <div class='container'>
    <!-- left-arrow:是否显示左侧箭头 -->
    <van-nav-bar left-arrow title="登录" @click-left="$router.back()"></van-nav-bar>
    <!-- 登录的基础布局：手机号  验证码  登录按钮 -->
    <van-cell-group>
      <van-field label="手机号" placeholder="请输入手机号"></van-field>
      <van-field label="验证码" placeholder="请输入验证码">
        <!-- slot指定给哪个坑填内容 -->
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <van-cell-group>
      <div class="btn-box">
        <!-- info是蓝色  round 圆角  block 是否为块级元素-->
        <van-button type="info" size="small" round block>登录</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'login'
}
</script>

<style lang="less" scoped>
.btn-box{
  padding: 10px;
}
</style>
