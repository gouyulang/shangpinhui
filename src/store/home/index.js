import {reqCategoryList,reqGetBannerList,reqGetFloorList} from '@/api/api';

// home模块的小仓库
export default {
    state:{
        // state中的数据不能乱写，服务器返回对象，初始值就设为对象。服务器返回数组，初始值就设为数组。
        
        // home仓库中存储三级菜单的数据
        categoryList:[],
        // 存储轮播图的数据
        bannerList:[],
        // Floor组件的数据
        floorList:[],
    },
    actions:{
        // 通过api里面的接口函数调用，向服务器发起请求，获取服务器的数据
        async categoryList(context){
            const result = await reqCategoryList();
            // console.log(result);
            if(result.code===200){
                context.commit('CATEGORYLIST',result.data);
            }
        },

        // 通过mockRequest里面的接口函数调用，向mockjs模拟数据发起请求,获取首页轮播图的数据
        async getBannerList(context){
            const result=await reqGetBannerList();
            // console.log(result);
            if(result.code===200){
                context.commit('GETBANNERLIST',result.data);
            }
        },

        // 获取foor数据
        async getFloorList(context){
            const result=await reqGetFloorList();
            // console.log(result);
            if(result.code===200){
                context.commit('GETFLOORLIST',result.data);
            }
        }

    },
    // mutations是唯一修改state的地方
    mutations:{
        CATEGORYLIST(state,categoryList){
            state.categoryList=categoryList;
        },
        GETBANNERLIST(state,bannerList){
            state.bannerList=bannerList;
        },
        GETFLOORLIST(state,floorList){
            state.floorList=floorList;
        },
    },
    // 计算属性：在项目中，是为了简化数据而生。
    getters:{}
}