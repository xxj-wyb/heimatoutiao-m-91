<template>
  <!-- 视频模块 -->
  <div>
    <div class="split"></div>
    <!-- 骨架屏：等待加载页面出来之前显示的内容 通过title属性显示标题占位图，通过row属性配置占位段落行数
      avatar: 显示头像占位图 -->
    <van-skeleton title avatar :row="3" />
    <div class="split"></div>
    <van-skeleton title avatar :row="3" />
    <div class="split"></div>
    <van-skeleton title avatar :row="3" />
  </div>
</template>

<script>
export default {
  name: 'video'
}
</script>

<style lang="less" scoped>
</style>
