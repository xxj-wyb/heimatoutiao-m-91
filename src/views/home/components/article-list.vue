<template>
  <!-- 这里面封装 上拉加载和下拉刷新的组件 -->

  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置；
    首先，给article-list组件定义一个属性来记录 当前的组件实例滚动的位置-->
  <div ref="myScroll" class="scroll-wrapper" @scroll="remember">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <!-- 放置list组件  list组件可以实现上拉加载 -->
      <van-list v-model="upLoading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- v-for 渲染数据 -->
        <!-- 点击van-cell 跳转到文章详情:van-cell组件有个to属性, 同router-link中的to属性，点击后跳转的目标路由对象-->
        <!-- 动态路由： query传值(?id=123)  params传值(/123)  -->
        <van-cell :to="`/article?articleId=${ article.art_id.toString() }`" v-for="article in articles" :key="article.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ article.title }}</h3>
            <!-- 三图模式 -->
            <div class="img_box" v-if="article.cover.type === 3">
              <!-- lazy-load:开启图片懒加载 -->
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[0]" />
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[1]" />
              <van-image lazy-load class="w33" fit="cover" :src="article.cover.images[2]" />
            </div>
            <!-- 单图模式 -->
            <div class="img_box" v-if="article.cover.type === 1">
              <van-image lazy-load class="w100" fit="cover" :src="article.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{article.aut_name}}</span>
              <span>{{article.comm_count}}评论</span>
              <!-- 使用过滤器处理相对时间  表达式 | 过滤器名称 -->
              <span>{{article.pubdate | relTime }}</span>
              <!-- 判断是否显示 叉号图标  登录状态应显示-->
              <!-- 在子组件中注册 点击叉号的事件,并且告诉父组件,我要反馈
                同时要传出文章id，,并且在父组件中接收 存储  stop 修饰符，阻止事件冒泡-->
              <span class="close" v-if="user.token" @click.stop="$emit('showAction',article.art_id.toString())">
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
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus'
export default {
  name: 'article-list',
  data () {
    return {
      downLoading: false, // 是否开启下拉刷新
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否已经完成全部的数据加载
      articles: [], // 定义一个数据来接收上拉加载的数据
      refreshSuccessText: '', // 下拉成功后显示的文本
      timestamp: null, // 定义一个时间戳 这个时间戳用来告诉服务器 现在我要什么样的时间的数据
      scrollTop: 0 // 记录当前文章实例所滚动的位置
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
  computed: {
    // 映射vuex中的store对象到计算属性上
    ...mapState(['user'])
  },
  created () {
    // 在created中只要开启一次监听，后面出发了事件，就会进入到回调函数
    // 开启监听:子组件监听该事件,并判断是否是自己下面的数据 ,找到删除
    // 监听  删除文章事件
    eventBus.$on('delArticle', (articleId, channelId) => {
      if (this.channel_id === channelId) {
        // 这个条件表示 该列表就是当前激活的列表
        /* 查找对应的文章: findIndex():该方法主要应用于查找第一个符合条件的数组元素。它的参数是一个回调函数
          当条件为true时返回的是索引值,否则返回 -1 */
        let index = this.articles.findIndex(item => item.art_id.toString() === articleId)
        // 如果index大于 -1 表示找到了 就要删除
        if (index > -1) {
          // splice() 方法可删除从 index 处开始的零个或多个元素
          this.articles.splice(index, 1)// 删除不喜欢的文章
        }
      }
    })
    // 开启一个新的监听 监听当前tab切换的事件
    eventBus.$on('changeTab', id => {
      // 判断切换的id是否等于article-list接收的频道id；这是因为artcile-list实例是有多个的
      if (id === this.channel_id) {
        // 如果相等 说明找对了对应的article-list实例
        // 因为 切换事件之后 会执行 dom的更新 => dom的更新是异步的
        // 如果保证自己 在上一次完成页面渲染更新之后 执行逻辑 => this.$nextTick()
        // this.$nextTick会保证在changeTab动作切换完成并且完成界面渲染之后执行
        this.$nextTick(() => {
          if (this.scrollTop && this.$refs.myScroll) {
            // 当滚动距离 不为0 且dom元素存在的情况下，即原来页面滚动了 才去执行滚回去的操作
            this.$refs.myScroll.scrollTop = this.scrollTop // 将原来记录的位置赋值给dom元素，滚到哪就记录到哪
          }
        })
      }
    })
  },
  methods: {
    // 定义一个记录滚动位置的方法
    remember (event) {
      // 记录此次滚动事件中的滚动条距离顶部的高度； scrollTop 获取元素滚动出去的距离
      // event.target 指的是 当前点击事件的元素
      this.scrollTop = event.target.scrollTop // 当前元素滚动出去的距离 就是滚动条滚动出去的距离
    },
    // 上拉加载方法
    // 上拉加载的数据是追加 ,每次加载的数据追加到原有数据的末尾
    async onLoad () {
      await this.$sleep() // 延迟处理：await 强制等待几秒
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
      await this.$sleep() // 延迟处理：await 强制等待几秒
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
      this.downLoading = false
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
  },
  // 激活函数 当组件被keep-alive 包裹，包裹的组件就不会被销毁,而是被缓存起来,那么组件实例就不会执行对应的 销毁钩子函数
  // 包裹关系：keep-alive => router-view => home => article-list
  // keep-alive 包裹的组件 当再次被唤醒的时候, 会执行它的 activated 和 deactivated 这两个函数
  activated () {
    // 唤醒的时候需要把记录的位置 恢复回去
    // 需要在组件重新激活时 重新 设置原来的滚动条
    if (this.$refs.myScroll && this.scrollTop) {
      // 当滚动距离 不为0 且dom元素存在的情况下，即原来页面滚动了 才去执行滚回去的操作
      // scrollTop 获取元素滚动出去的距离
      this.$refs.myScroll.scrollTop = this.scrollTop // 将原来记录的位置赋值给dom元素，滚到哪就记录到哪
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
