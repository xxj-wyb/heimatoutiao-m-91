<template>
  <!-- 首页模块 -->
  <div class="container">
    <!-- 通过 swipeable 属性可以开启左右滑动切换标签页 -->
    <!-- 监听 tabs切换事件 -->
    <van-tabs v-model="activeIndex" swipeable @change="changeTab">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 将channel_id传递给article_list: 给谁传值，就给谁加属性 -->
        <!-- 如果要监听子组件的事件, 就应该在子组件的标签上写监听 -->
        <article-list @showAction="openMoreAction" :channel_id="channel.id"></article-list>
      </van-tab>
    </van-tabs>
    <!-- 显示编辑频道的图标 -->
    <span class="bar_btn" @click="showChannelEdit=true">
      <van-icon name="wap-nav" />
    </span>
    <!-- 放置弹层组件 -->
    <van-popup v-model="showMoreAction" :style="{ width: '80%' }">
      <!-- 包裹反馈组件 -->
      <!-- 父组件监听事件 -->
      <!-- report事件中的第一个参数 $event实际上就是 moreAction组件 传出的type(item.value);
      dislike事件中的$event就相当于占位符-->
      <more-action
        @dislike="dislikeOrReport($event,'dislike')"
        @report="dislikeOrReport($event,'report')"
      ></more-action>
    </van-popup>

    <!-- 编辑频道  van-action-sheet通过v-model绑定显示隐藏 -->
    <van-action-sheet :round="false" title="编辑频道" v-model="showChannelEdit">
      <!-- 放置频道编辑组件 -->
      <!-- 频道数据在home组件中,可以直接用props传递给channel_edit组件,给谁传递就给谁添加属性 -->
      <!-- 父组件监听 选择频道事件 -->
      <channel-edit
        @addChannel="addChannel"
        @delChannel="delChannel"
        :activeIndex="activeIndex"
        @selectChannel="selectChannel"
        :channels="channels"
      ></channel-edit>
    </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { getMyChannels, delChannel, addChannel } from '@/api/channels'
import { disLikeArticle, reportArticle } from '@/api/article'
import eventBus from '@/utils/eventBus'
import ChannelEdit from './components/channel-edit'

export default {
  name: 'home', // 用devtools查看组件时，可以看到对应的name名称
  data () {
    return {
      activeIndex: 0, // 默认激活第0个标签
      channels: [], // 声明接收频道的数据
      showMoreAction: false, // 用来控制显示反馈层，默认不显示
      articleId: null, // 定义一个值接收文章id
      showChannelEdit: false // 设置频道编辑的显示或隐藏
    }
  },
  components: {
    ArticleList,
    MoreAction,
    ChannelEdit // 局部注册组件
  },
  created () {
    this.getMyChannels() // 获取频道
  },
  methods: {
    // 当切换tab标签栏时会触发
    changeTab () {
      // 通知所有的article-list实例 告诉他们 切换页签了,把切换的页签传过去
      // article-list组件需要 拿到传过去的的页签 看看是否是自己所在的页签
      // 如果是自己所在的页签 就需要 判断一下 自己的组件是否有滚动 如果有滚动数据 就滚动对应的位置
      // 触发一个公共事件 事件名叫 切换页签 携带参数(传的页签的id)
      // 把激活索引下对应的频道id传过去 可以再devtools里面的home组件查看
      // 切换标签 改变article-list实例内容， 是非父子间的 父传子
      eventBus.$emit('changeTab', this.channels[this.activeIndex].id) // this.channels 所有频道
    },
    // 删除频道的方法
    async delChannel (id) {
      try {
        await delChannel(id) // 表示删除数据成功
        // 要移除自身data中channels中的数据
        let index = this.channels.findIndex(item => item.id === id) // 找到删除的索引
        if (index <= this.activeIndex) {
          // 如果删除的频道在当前激活频道之前或者就是当前激活频道
          // 要把我们的激活索引往前挪一位
          this.activeIndex = this.activeIndex - 1
        }
        if (index > -1) {
          this.channels.splice(index, 1) // 移除当前频道
        }
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '删除频道失败' })
      }
    },
    // 添加频道
    async addChannel (channel) {
      await addChannel(channel) // 完成写入本地缓存的操作 这只是写入缓存
      this.channels.push(channel) // 这一步是修改 data中的数据
    },
    // 切换到对应的频道 关闭弹层
    selectChannel (id) {
      // 要通过id找到对应的频道索引
      let index = this.channels.findIndex(item => item.id === id) // 获取切换频道的索引
      this.activeIndex = index // 将tabs激活标签切换到对应的标签下
      this.showChannelEdit = false // 关闭频道编辑的弹层
    },
    async getMyChannels () {
      // 获取频道列表数据
      let data = await getMyChannels()
      this.channels = data.channels // 将频道赋值给声明的变量
    },
    // 监听子组件触发的事件 打开弹层
    openMoreAction (artId) {
      // 打开弹层
      this.showMoreAction = true
      this.articleId = artId // 接受不喜欢文章的id
    },
    // // 调用不喜欢的文章接口
    // async dislike () {
    //   try {
    //     await disLikeArticle({ target: this.articleId })
    //     this.$gnotify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     // 触发一个事件  相当于发出一个广播 听到广播的文章列表 去删除对应的数据
    //     // 分别传入 文章id 频道id
    //     eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     this.showMoreAction = false // 关闭弹层
    //   } catch (error) {
    //     this.$gnotify({
    //       type: 'danger',
    //       message: '操作失败'
    //     })
    //   }
    // },
    // // 调用举报文章的接口
    // async report(type){
    //   try {
    //     await reportArticle({ target:this.articleId,type })
    //     this.$gnotify({
    //       type:'success',
    //       message:'操作成功'
    //     })
    //     eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     this.showMoreAction = false // 关闭弹层
    //   } catch (error) {
    //      this.$gnotify({
    //       type:'danger',
    //       message:'操作失败'
    //     })
    //   }
    // },

    // 不喜欢或举报文章  通过 封装抽提 将两个方法 合成一个
    // operateType 操作类型 dislike /report
    // params是 举报类型的参数
    async dislikeOrReport (params, operateType) {
      try {
        operateType === 'dislike'
          ? await disLikeArticle({ target: this.articleId })
          : await reportArticle({ target: this.articleId, type: params })
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 触发一个事件  相当于发出一个广播 听到广播的文章列表 去删除对应的数据
        // 分别传入 文章id 频道id
        eventBus.$emit(
          'delArticle',
          this.articleId,
          this.channels[this.activeIndex].id
        )
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
// 编辑频道面板的样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
</style>
