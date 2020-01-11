<template>
<!-- 布局模块 -->
  <div>
    <!-- 可以采用vant的导航组件来实现 -->
    <van-nav-bar></van-nav-bar>
    <!-- 二级路由容器： 首页、问答、视频、我的 -->
    <router-view></router-view>
    <!-- 标签栏 -->
    <van-tabbar>
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout'
}
</script>

<style lang="less" scoped>
</style>
