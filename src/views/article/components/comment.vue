<template>
<!-- 评论列表组件 -->
  <div class="comment">
      <!-- 评论列表 需要功能：上拉加载loading； 是否全部加载完成：finished -->
      <!-- van-list组件可以完成上拉加载功能：当组件滚动到底部时，会触发load事件并将loading设置成true -->
    <van-list v-model="loading" :finished="finished" @load="onLoad" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{ comment.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <p>{{ comment.content }}</p>
          <p>
            <span class="time">{{ comment.pubdate | relTime }}</span>&nbsp;
            <!-- 通过openReply()方法传递点击的评论的id -->
            <van-tag plain @click="openReply(comment.com_id)">{{ comment.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 提交模块 -->
    <div class="reply-container van-hairline--top">
      <!-- 给v-model一个修饰符 trim ，去掉评论内容前后的空格 -->
      <van-field v-model.trim="value" placeholder="写评论...">
        <!-- van-loading 加载状态通过 submiting 状态来控制显示 -->
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" @click="submit()" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 对评论进行回复的列表弹层 -->
    <!-- van-action-sheet:通过v-model来绑定显示或隐藏,点击回复的时候才打开对评论的评论列表; 第一次不会主动调用load事件 -->
    <!-- 当关闭这个回复的弹层时，应该清除掉reply.commentId，以便作为下一次评论评论的依据 -->
    <van-action-sheet @closed="reply.commentId=null"  v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <!-- 回复组件 -->
      <!-- immediate-check:是否在初始化时立即执行滚动位置检查; 这里不要一进入页面就加载页面，要在点击回复以后再加载，所以设置为false -->
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <!-- 要循环的数据 -->
        <div class="item van-hairline--bottom van-hairline--top" v-for="reply in reply.list" :key="reply.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="reply.aut_photo" />
          <div class="info">
            <p><span class="name">{{ reply.aut_name }}</span></p>
            <p>{{ reply.content }}</p>
            <!--用过滤器 处理相对时间 -->
            <p><span class="time">{{ reply.pubdate | relTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentOrReply } from '@/api/article' // 引入封装的获取评论和回复评论的方法
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      // 用来存放评论列表的数据
      comments: [],
      // 表示分页依据 如果为空,表示从第一页开始;第二页数据需要传入第一页返回的最后一个id
      offset: null, // 获取文章评论的分页依据
      showReply: false, // 控制回复列表组件的显示和隐藏
      reply: {
        // 专门用reply这个对象存放回复相关的数据
        loading: false, // 是回复列表组件的状态
        finished: false, // 是回复列表组件的结束状态
        offset: null, // 偏移量 获取评论的评论的分页依据 类型为 c
        list: [], // 用于存放 当前弹出的关于某个评论的回复列表的数据
        commentId: null // 用来存放 当前点击的评论Id
      }
    }
  },
  methods: {
    // 提交评论的方法
    async submit () {
      if (!this.value) return false // 表示如果当前评论内容为空就立刻返回
      this.submiting = true // 将提交状态设置成true,开启提交按钮的加载时间 控制用户单位时间内评论的数据次数
      await this.$sleep() // 强制等待500 毫秒
      try {
        // 评论 一种是对文章进行评论 一种是对评论进行评论
        // 怎么样区分当前是对文章进行评论 还是对评论进行评论
        // 两种方式 一种方式 通过 showReply的true/false
        // 一种方式 通过 reply.commentId是否存在
        const data = await commentOrReply({
          // 后台需要传入的三个参数
          // this.reply.commentId 存在就要对评论进行评论，传入commentId  否则传文章ID
          target: this.reply.commentId ? this.reply.commentId.toString() : this.$route.query.articleId,
          content: this.value, // 评论的内容
          // art_id:文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
          art_id: this.reply.commentId ? this.$route.query.articleId : null
        })
        // 评论成功后 刷新页面 => 将评论的数据呈现到 视图上
        // 首先需要知道加个哪个数组的最前面
        if (this.reply.commentId) {
          // 对评论进行评论
          this.reply.list.unshift(data.new_obj) // 将数据加到 队首 评论的评论
          // 如果对评论的进行评论之后, 应该找到该评论 并将 该评论的回复次数 +1
          // 用find（）方法找到对应的评论,为true返回该元素，并生成一个新数组
          // 如果找到了 comment就是找到的对象 如果找不到 comment就是一个undefined
          const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId.toString())
          comment && comment.reply_count++ // 如果找到了 就对回复数据加1
        } else {
          // 对文章进行评论
          this.comments.unshift(data.new_obj) // 文章评论
        }
        // 评论成功后要清空输入框
        this.value = ''
      } catch (error) {
        this.$gnotify({ type: 'danger', message: '评论失败' })
      }
      // 最后去关闭 状态
      this.submiting = false // 关闭进度条
    },
    // 打开对评论的回复
    openReply (commentId) {
      this.showReply = true // 弹出面板
      // 当打开对话框的时候，获取ID，进行加载, 需要重置数据
      this.reply.commentId = commentId // 存储当前点击的commentId
      this.reply.list = [] // 清空原有的数据
      this.reply.offset = null // 重置回复的偏移量 因为每个评论的评论都是从第一页开始
      this.reply.finished = false // 设置成原始状态
      this.reply.loading = true // 主动打开加载状态 因为这个时候没有了自动的检查
      // 开始加载第一页的数据
      this.getReply() // 开始调用第一页的数据
    },
    // 获取评论的评论 也就是获取回复数据的方法
    async getReply () {
      // 加载逻辑
      let data = await getComments({
        type: 'c', // c代表获取评论的评论
        offset: this.reply.offset, // 偏移量
        source: this.reply.commentId.toString() // 代表获取的评论(id)的评论
      })
      this.reply.list.push(...data.results) // 将评论的评论加到尾部
      // 拿到的data只是请求的第一页的数据
      this.reply.loading = false // 评论的评论的加载状态关闭
      // 如果last_id 等于end_id表示 没有数据可以再加载了
      this.reply.finished = data.end_id === data.last_id
      if (!this.reply.finished) {
        //  意味着有下一页的数据
        this.reply.offset = data.last_id // 把当前页的最后一个id给偏移量 作为请求下一页的参数依据
      }
    },
    // 一级评论：对文章进行评论 type类型为a
    async onLoad () {
      // 加载评论数据
      let data = await getComments({
        type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        offset: this.offset, // 偏移量：为空,表示从第一页开始
        source: this.$route.query.articleId // 从路由中获取文章id
      })
      // 将数据添加到当前评论列表的尾部
      this.comments.push(...data.results)
      // 关闭正在上拉加载的状态
      this.loading = false
      // 如果当前页ID等于整个评论最后一个id 表示 我们已经请求完了所有的数据; 此时关闭加载状态
      this.finished = data.last_id === data.end_id
      if (!this.finished) {
        // 表示 last_id 和 end_id不等 不等的话表示 还有下一页数据
        this.offset = data.last_id // 将last_Id设置成下一页的请求依据
      }
    }
  }
}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
