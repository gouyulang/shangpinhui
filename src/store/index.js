import Vue from 'vue';
import Vuex from 'vuex';
// 需要使用一下插件
Vue.use(Vuex);

// 引入小仓库
import home from './home/index';
import search from './search/index';
import detail from './detail/index';
import shopcart from './shopcart/index';
import user from './user/index';
import trade from './trade/index';

// 对外暴露store类的一个实例
export default new Vuex.Store({
    // 实现vuex仓库模块式开发存储数据
    modules:{
        home,
        search,
        detail,
        shopcart,
        user,
        trade,
    }
})




