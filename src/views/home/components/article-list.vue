<template>
  <!-- 这里面封装 上拉加载和下拉刷新的组件 -->

  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <!-- 放置list组件  list组件可以实现上拉加载 -->
    <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
    </van-list>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否开启上拉加载
      finished: false // 是否已经完成全部的数据加载
    }
  },
  methods: {
    // 上拉加载方法
    onLoad () {
      console.log('开始加载数据')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
