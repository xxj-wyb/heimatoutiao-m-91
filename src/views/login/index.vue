<template>
<!-- 登录页面 -->
  <div class='container'>
    <!-- left-arrow:是否显示左侧箭头 -->
    <van-nav-bar left-arrow title="登录" @click-left="$router.back()"></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'login'
}
</script>

<style lang="less" scoped>
</style>
