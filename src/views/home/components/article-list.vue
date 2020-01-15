<template>
  <!-- 这里面封装 上拉加载和下拉刷新的组件 -->

  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <!-- 放置list组件  list组件可以实现上拉加载 -->
      <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- v-for 渲染数据 -->
        <van-cell v-for="article in articles" :key="article" :title="article" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      downLoading: false, // 是否开启下拉刷新
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否已经完成全部的数据加载
      articles: [], // 定义一个数据来接收上拉加载的数据
      refreshSuccessText: '' // 下拉成功后显示的文本
    }
  },
  methods: {
    // 上拉加载方法
    // 上拉加载的数据是追加 ,每次加载的数据追加到原有数据的末尾
    onLoad () {
      console.log('开始加载数据')
      // 生成模拟数据： Array.from()方法就是将一个类数组对象或者可遍历对象转换成一个真正的数组，第二个参数一个回调函数，返回的是是数组里面的值
      setTimeout(() => {
        // 给数据设置一个上限 ,不超过50条调用upLoading加载数据， 如果超过50条，就不用自动加载了
        if (this.articles.length < 50) {
          let arr = Array.from(
            Array(10),
            (value, index) => this.articles.length + index + 1
          )
          // 把生成的数据追加到末尾  ...arr：解构数组，生成一个个元素
          this.articles.push(...arr)
          // 加载数据完毕后, 将原来的loading状态设置为 false
          this.upLoading = false
        } else {
          // 如果超过50条,告诉list组件  我已经加载完了 不要再去触发onLoad事件了
          this.finished = true
        }
      }, 1000)
    },

    // 下拉刷新的方法
    // 下拉刷新的数据应该 添加到原有数据的头部,并且要关闭加载状态
    onRefresh () {
      // 模拟数据逻辑:触发下拉刷新
      console.log('下拉刷新')
      setTimeout(() => {
        let arr = Array.from(Array(10), (value, index) => ('追加' + (index + 1)))
        // 添加到头部方法： unshift()
        this.articles.unshift(...arr)
        this.downLoading = false // 关掉下拉状态
        this.refreshSuccessText = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
