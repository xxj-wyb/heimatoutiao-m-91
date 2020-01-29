<template>
  <div class="container">
    <!-- 搜索组件是一级路由，需要个导航栏  -->
    <!-- left-arrow:是否显示左侧箭头； back()：返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索框 -->
    <!-- 如果想自动过滤前后空格,可以给v-model一个修饰符 trim -->
    <!-- search事件：确定搜索时触发 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 有输入内容时  =>显示联想搜索， 没内容时  => 显示历史记录-->
    <!-- 联想搜索 -->
    <van-cell-group class="suggest-box" v-if="q" >
      <van-cell @click="toSearchResult(item)" icon="search" v-for="item in suggestList" :key="item">
        {{ item }}
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <!-- 只有当有历史记录的时候 才显示整个历史的记录的盒子 -->
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <!-- 清空所有历史 -->
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <!-- 循环生成历史记录  item是惟一的 搜索历史记录不应该重复 -->
        <!-- 根据历史去搜索=>点击历史记录时,跳到搜索结果,给历史搜索注册点击事件 -->
        <van-cell  @click="toResult(item)" v-for="(item,index) in historyList" :key="item">
          <!-- item就是搜索的关键字 -->
          <a class="word_btn">{{item}}</a>
          <!-- 给删除按钮注册删除事件 -->
          <!-- 事件修饰符 事件名.stop 表示 阻止了事件冒泡 -->
          <van-icon @click.stop="delHistory(index)"  class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggestion } from '@/api/article'
const key = 'hm-91-toutiao-history' // 定义一个key，用来当做存储 本地历史记录的key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 查询内容
      historyList: [], // 存放历史记录的数据
      suggestList: [] // 存放联想建议的数组
    }
  },
  // 用watch监听 关键字 改变，进行联想补全
  watch: {
    // 防抖搜索 只执行最后一次
    // q () {
    //   clearTimeout(this.timer) // 在输入完成之前，清除定时器，只执行最后一次
    //   this.timer = setTimeout(async () => {
    //     // 搜索联想的词汇
    //     if (!this.q) {
    //       // 当搜索关键字变成空的时候将 联想数组清空
    //       this.suggestList = []
    //       return false // 直接返回 下面不再执行
    //     }
    //     let data = await suggestion({ q: this.q }) // 搜索联想建议
    //     this.suggestList = data.options
    //   }, 500)
    // }

    // 节流搜索  在单位时间内按频率执行一次
    q () {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          this.timer = null // 将定时器的标记清空
          // 搜索联想的词汇
          if (!this.q) {
            this.suggestList = [] // 当搜索关键字变成空的时候将 联想数组清空
            return false // 直接返回 下面不再执行
          }
          let data = await suggestion({ q: this.q })
          this.suggestList = data.option
        }, 500)
      }
    }
  },
  methods: {
    delHistory (index) {
      this.historyList.splice(index, 1)// 删除对应的历史记录
      localStorage.setItem(key, JSON.stringify(this.historyList))// 重新写入缓存
    },
    // 跳到搜索结果页面
    toResult (text) {
      this.$router.push({ path: '/search/result', query: { q: text } }) // 直接跳转到搜索结果界面
    },
    // 清空所有历史
    clear () {
      this.historyList = [] // 清空所有历史
      localStorage.setItem(key, '[]') // 重新写入缓存
    },
    // 历史记录：什么时候触发搜索： 回车/虚拟键盘搜索
    onSearch () {
      // 跳转到搜索结果之前 应该把当前的搜索关键字 写入到历史记录
      if (!this.q) return // 如果q为空则没有必要往下走
      // 如果不为空 要将this.q加入到历史记录中去
      let obj = new Set(this.historyList)// 生成一个set变量用来接收历史关键字  new Set会自动去重
      obj.add(this.q)
      this.historyList = Array.from(obj) // Array.from(): 将set转为数组
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存
      //  触发搜索事件应该去搜索结果页面 而且 也要携带参数
      this.$router.push({ path: '/search/result', query: { q: this.q } }) // 直接跳转到搜索结果界面
    },
    // 联想搜索： 将点击的搜索选项加入到搜索历史,并且跳到搜索结果页面
    toSearchResult (text) {
      // 放入历史记录
      let obj = new Set(this.historyList) // 生成一个set变量用来接收历史关键字  new Set会自动去重
      obj.add(text) // 把搜索出来的文本也放入历史记录中
      this.historyList = Array.from(obj) // Array.from(): 将set转为数组
      localStorage.setItem(key, JSON.stringify(this.historyList))// 重新写入缓存
      this.$router.push({ path: '/search/result', query: { q: text } })// 直接跳转到搜索结果界面
    }
  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]') // 短路表达式，读取本地化的内容
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
