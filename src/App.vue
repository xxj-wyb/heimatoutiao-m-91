<template>
<!-- 这里面放 根组件 -->
  <div id="app">
    <keep-alive>
      <!-- keep-alive包裹一级路由容器，即 将所有的一级路由组件都进行了缓存 -->
      <!-- 通过 meta 这个标记来决定是否采用 keep-alive 来包裹 一级路由容器 -->
      <!-- $route.meta.isAlive 如果为true，就需要用 keep-alive 来包裹；
           $route.meta.isAlive 如果为false，就必须把 router-view 放在keep-alive之外-->
      <!-- 如果为true，就需要用 keep-alive 来包裹 -->
      <router-view v-if="$route.meta.isAlive"></router-view>
    </keep-alive>
    <!-- 如果为false 就放在外面 -->
      <router-view v-if="!$route.meta.isAlive"></router-view>
      <!-- 这个可以保证 只有layout中的组件可以被缓存 -->
  </div>
</template>

<style lang="less">
</style>
