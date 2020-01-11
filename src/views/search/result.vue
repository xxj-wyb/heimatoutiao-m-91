<template>
<!-- 搜索结果组件 -->
  <div class="container">
    <!-- 一级路由需要导航栏 -->
    <!-- left-arrow:是否显示左侧箭头 -->
    <van-nav-bar left-arrow title="搜索结果" @click-left="$router.back()"></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'searchResult'
}
</script>

<style lang="less" scoped>
</style>
