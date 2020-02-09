<template>
  <!-- 布局模块: 里面包含 首页、问答、视频、我的 四个二级路由 -->
  <div class="container">
    <!-- 可以采用vant的导航组件来实现 -->
    <!-- fixed 是否固定-->
    <!-- 如果选中的是'我的'标签，应该隐藏 NavBar , 此时内容容器 my-wrapper要去除上内边距。 -->
    <van-nav-bar @click-right="$router.push('/search')" v-if="showNavBar" fixed title="黑马头条" right-text="搜索"></van-nav-bar>
    <div class="my-wrapper" :class="{ noTop: !showNavBar }">
      <!-- 用keep-alive包裹路由容器; 如果想要缓存的二级路由组件的话 可以直接缓存二级路由容器
        如果缓存了这个容器 表示 这个容器下的所有的组件都会被缓存 -->
      <keep-alive>
        <!-- 二级路由容器(必须有)： 首页、问答、视频、我的 -->
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- 标签栏 -->
    <!-- 标签栏  开启路由模式 route  :route="true"(布尔)  route="true"(字符串)-->
    <van-tabbar route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout',
  computed: {
    // 是否显示navbar
    showNavBar () {
      // 计算属性必须有返回值
      // this  指向 组件实例
      return this.$route.path !== '/user'
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
