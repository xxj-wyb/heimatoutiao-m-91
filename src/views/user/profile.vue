<template>
<!-- 编辑资料 -->
  <div class='container'>
    <!-- left-arrow:是否显示左侧箭头 -->
    <van-nav-bar left-arrow title="编辑资料" right-text="保存" @click-left="$router.back()"></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'profile'
}
</script>

<style lang="less" scoped>
</style>
