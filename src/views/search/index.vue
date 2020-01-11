<template>
<!-- 搜索模块 -->
  <div class='container'>
    <!-- 搜索组件是一级路由，需要个导航栏  -->
    <!-- left-arrow:是否显示左侧箭头； back()：返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'search'
}

</script>

<style lang="less" scoped>
</style>
