<template>
  <div>
    <Header />
    <!-- 路由组件的展示位置 -->
    <router-view></router-view>
    <!-- Footer 在Home,Search显示,在Login,Register隐藏 -->
    <!-- 利用路由元信息解决当前问题好处：一行代码就可以解决 -->
    <Footer v-show="$route.meta.show" />

  </div>
</template>

<script>
import Header from './components/Header';
import Footer from './components/Footer';

export default {
  name: 'MyApp',
  components: {
    Header,
    Footer
  },
  mounted() {
    // 派发一个action，获取商品分类的三级列表
    // 通知vuex发请求，获取数据，存储于store仓库当中
    this.$store.dispatch('categoryList');
  }
};
</script>

<style scoped></style>