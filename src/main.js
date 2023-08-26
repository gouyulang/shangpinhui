import Vue from 'vue';
import App from './App.vue';

// 引入路由
import router from '@/router/index';

// 引入store
import store from '@/store/index';

// 三级联动组件--全局组件
// 三级联动全局组件：在使用时不需要引入即可使用。（因为全局组件在注册时就已经引入了）
import TypeNav from '@/components/TypeNav/index';
// Vue.component() 第一个参数：全局组件的名字，第二个参数：哪一个组件
Vue.component(TypeNav.name,TypeNav);

// 轮播图组件-全局组件
import Carousel from '@/components/Carousel/index';
Vue.component(Carousel.name,Carousel);

// 分页器组件-全局组件
import Pagination from '@/components/Pagination/index';
Vue.component(Pagination.name,Pagination);

// 部分引入并注册element-ui组件MessageBox
import { MessageBox } from 'element-ui';
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

// 引入mockServe.js文件---mock数据
import '@/mock/mockServe';

// 引入Swiper样式
import 'swiper/css/swiper.min.css';

// 统一接口api文件里面全部的请求函数
import * as API from '@/api/api';
// console.log(API);

// 引入并注册图片懒加载插件
import VueLazyload from 'vue-lazyload';
import lazyPicture from '@/assets/logo.png'
Vue.use(VueLazyload,{
  // 懒加载默认的图片
  loading:lazyPicture,
});

// 引入表单校验插件
import '@/plugins/validate';

// 关闭生产提示
Vue.config.productionTip = false;
new Vue({
  render: h => h(App),
  beforeCreate(){
    // 安装全局事件总线
    Vue.prototype.$bus=this;
    Vue.prototype.$API=API;
  },
  // 注册路由：当这里书写router的时候，组件身上都拥有$route,$router属性
  router,
  // 注册store：组件实例身上会多出一个属性$store,
  store
}).$mount('#app');

