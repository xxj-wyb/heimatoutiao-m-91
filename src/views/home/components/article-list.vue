<template>
  <!-- 这里面封装 上拉加载和下拉刷新的组件 -->

  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <!-- 放置list组件  list组件可以实现上拉加载 -->
      <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- v-for 渲染数据 -->
        <van-cell v-for="article in articles" :key="article.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ article.title }}</h3>
            <!-- 三图模式 -->
            <div class="img_box" v-if="article.cover.type === 3">
              <van-image class="w33" fit="cover" :src="article.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="article.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="article.cover.images[2]" />
            </div>
            <!-- 单图模式 -->
            <div class="img_box" v-if="article.cover.type === 1">
              <van-image class="w100" fit="cover" :src="article.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{article.aut_name}}</span>
              <span>{{article.comm_count}}评论</span>
              <span>{{article.pubdate}}</span>
              <span class="close">
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article' // 引入请求模块
export default {
  name: 'article-list',
  data () {
    return {
      downLoading: false, // 是否开启下拉刷新
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否已经完成全部的数据加载
      articles: [], // 定义一个数据来接收上拉加载的数据
      refreshSuccessText: '', // 下拉成功后显示的文本
      timestamp: null // 定义一个时间戳 这个时间戳用来告诉服务器 现在我要什么样的时间的数据
    }
  },
  props: {
    // channel_id在 父组件 home的 index.vue 中,要用 props 传值
    // props也可以跟一个对象
    channel_id: {
      type: Number, // 指定要传的props类型
      required: true, // 要求必须传props
      default: null // 给props一个默认值
    }
  },
  methods: {
    // 上拉加载方法
    // 上拉加载的数据是追加 ,每次加载的数据追加到原有数据的末尾
    async onLoad () {
      // console.log('开始加载数据')
      // // 生成模拟数据： Array.from()方法就是将一个类数组对象或者可遍历对象转换成一个真正的数组，第二个参数一个回调函数，返回的是是数组里面的值
      // setTimeout(() => {
      //   // 给数据设置一个上限 ,不超过50条调用upLoading加载数据， 如果超过50条，就不用自动加载了
      //   if (this.articles.length < 50) {
      //     let arr = Array.from(
      //       Array(10),
      //       (value, index) => this.articles.length + index + 1
      //     )
      //     // 把生成的数据追加到末尾  ...arr：解构数组，生成一个个元素
      //     this.articles.push(...arr)
      //     // 加载数据完毕后, 将原来的loading状态设置为 false
      //     this.upLoading = false
      //   } else {
      //     // 如果超过50条,告诉list组件  我已经加载完了 不要再去触发onLoad事件了
      //     this.finished = true
      //   }
      // }, 1000)

      // 生成真实数据
      // 判断当前时间戳是否为空，若为空，则传入当前时间Date.now()
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      // 追加数据到队尾
      this.articles.push(...data.results) // 返回的 results 是一个数组，用 ... 解构成一个个元素
      // 加载数据完毕后, 将原来的loading状态设置为 false，关闭加载状态
      this.upLoading = false
      // 判断历史时间戳 pre_timestamp， 如果有历史 表示还可以继续往下看 否则就不看了
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        // 否则认为 没有历史了 没有必要继续加载了
        this.finished = true // 告诉list组件  我已经加载完了 不要再去触发onLoad事件了
      }
    },

    // 下拉刷新的方法
    // 下拉刷新的数据应该 添加到原有数据的头部,并且要关闭加载状态
    async onRefresh () {
      // // 模拟数据逻辑:触发下拉刷新
      // console.log('下拉刷新')
      // setTimeout(() => {
      //   let arr = Array.from(Array(10), (value, index) => '追加' + (index + 1))
      //   // 添加到头部方法： unshift()
      //   this.articles.unshift(...arr)
      //   this.downLoading = false // 关掉下拉状态
      //   this.refreshSuccessText = `更新了${arr.length}条数据`
      // }, 1000)

      // 下拉刷新永远拉取的是最新的数据
      const data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      this.downLoading = false // 关掉下拉状态
      // 判断有没有最新数据
      if (data.results.length) {
        // 如果长度大于0 表示有数据
        this.articles = data.results // 将历史数据全都覆盖掉
        // 之前已经将上拉加载finished设置成true了,此时需要继续往下拉，就需要把原来的状态再次打开
        this.finished = false
        // 注意此时依然需要获取此次的历史时间戳
        this.timestamp = data.pre_timestamp // 下拉刷新之后，再上拉加载时，会用到这个历史时间戳的
        this.refreshSuccessText = `更新了${data.results.length}条数据`
      } else {
        //  如果没有数据更新  什么都不需要变化
        this.refreshSuccessText = '已是最新数据'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
