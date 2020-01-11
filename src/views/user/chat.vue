<template>
  <!-- 小智同学组件 -->
  <div class="container">
    <!-- left-arrow:是否显示左侧箭头 -->
    <van-nav-bar left-arrow title="小智同学"  @click-left="$router.back()"></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'chat'
}
</script>

<style lang="less" scoped>
</style>
