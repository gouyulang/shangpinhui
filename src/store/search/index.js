import {reqGetSearchInfo} from '@/api/api';

// search模块的小仓库
export default {
    state:{
        // 存放服务器返回的数据
        searchList:{},
    },
    // mutations是唯一修改state的地方
    mutations:{
        GETSEARCHLIST(state,searchList){
            state.searchList=searchList;
        },
    },
    actions:{
        // 获取search模块数据
        // 通过api里面的接口函数调用，向服务器发起请求，获取服务器的数据
        async getSearchList(context,params){
            // 当前这个reqGetSearchInfo()这个函数在调用获取服务器数据的时候，至少要传递一个参数（可以是空对象）
            // params形参：是当用户派发action的时候，第二个参数传递过来的，至少是一个空对象。
            const result = await reqGetSearchInfo(params);
            // console.log(result);
            if(result.code===200){
                context.commit('GETSEARCHLIST',result.data);
            }
        },
    },
    // 计算属性：在项目中，主要是为了简化仓库中的数据而生。
    // 可以把我们将来在组件当中需要用的数据简化一下，将来组件在获取数据的时候就方便一些了
    getters:{
        // state参数：就是当前仓库中的state
        goodsList(state){
            // 一个问题：如果服务器数据回来了，返回正确是一个数组。但是假如网络不给力或者没有网，goodsList返回的就是undefined，就会导致浏览器报错。
            // 解决：所以我们属性值至少得返回一个空数组，以防万一。
            return state.searchList.goodsList||[];
        },
        trademarkList(state){
            return state.searchList.trademarkList || [];
        },
        attrsList(state){
            return state.searchList.attrsList || [];
        },
    }
}