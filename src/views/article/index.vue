<template>
<!-- 文章模块 -->
  <div class='container'>
    <!-- left-arrow:是否显示左侧箭头 -->
    <van-nav-bar left-arrow title="文章详情" @click-left="$router.back()"></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'article'
}
</script>

<style lang="less" scoped>
</style>
