<template>
  <!-- 首页模块 -->
  <div class="container">
    <!-- 通过 swipeable 属性可以开启左右滑动切换标签页 -->
    <van-tabs v-model="activeIndex" swipeable>
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 将channel_id传递给article_list: 给谁传值，就给谁加属性 -->
        <!-- 如果要监听子组件的事件, 就应该在子组件的标签上写监听 -->
        <article-list @showAction="openMoreAction" :channel_id="channel.id"></article-list>
      </van-tab>
  </van-tabs>
  <span class="bar_btn">
      <van-icon name="wap-nav" />
  </span>
  <!-- 放置弹层组件 -->
  <van-popup v-model="showMoreAction" :style="{ width: '80%' }">
    <!-- 包裹反馈组件 -->
    <more-action @dislike="dislike"></more-action>
  </van-popup>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { getMyChannels } from '@/api/channels'
import { disLikeArticle } from '@/api/article'
import eventBus from '@/utils/eventBus'

export default {
  name: 'home', // 用devtools查看组件时，可以看到对应的name名称
  data () {
    return {
      activeIndex: 0, // 默认激活第0个标签
      channels: [], // 声明接收频道的数据
      showMoreAction: false, // 用来控制显示反馈层，默认不显示
      articleId: null // 定义一个值接收文章id
    }
  },
  components: {
    ArticleList, MoreAction // 局部注册组件
  },
  created () {
    this.getMyChannels() // 获取频道
  },
  methods: {
    async getMyChannels () {
      // 获取频道列表数据
      let data = await getMyChannels()
      this.channels = data.channels // 将频道赋值给声明的变量
    },
    // 监听子组件触发的事件 打开弹层
    openMoreAction (artId) {
      this.showMoreAction = true
      this.articleId = artId // 接受不喜欢文章的id
    },
    // 调用不喜欢的文章接口
    async dislike () {
      try {
        await disLikeArticle({ target: this.articleId })
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 触发一个事件  相当于发出一个广播 听到广播的文章列表 去删除对应的数据
        // 分别传入 文章id 频道id
        eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        this.showMoreAction = false // 关闭弹层
      } catch (error) {
        this.$gnotify({
          type: 'danger',
          message: '操作失败'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
