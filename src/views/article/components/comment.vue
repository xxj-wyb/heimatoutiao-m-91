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
            <van-tag plain @click="showReply=true">{{ comment.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments } from '@/api/article' // 引入封装的获取评论的方法
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
      offset: null
    }
  },
  methods: {
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
</style>
