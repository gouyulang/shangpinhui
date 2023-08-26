import { reqGetDetailInfo,reqAddOrUpdateShopCart } from '@/api/api';
// 引入封装游客身份模块的函数
import {getUUID} from '@/utils/uuid_token';

// detail模块的小仓库
export default {
    state: {
        // 存放产品详情信息
        detailList:{},
        // 游客临时身份--随机字符串
        uuid_token:getUUID(),
    },
    actions: {
        // 通过api里面的接口函数调用，向服务器发起请求，获取服务器的数据
        async getDetailList(context,skuId) {
            const result = await reqGetDetailInfo(skuId);
            // console.log(result);
            if (result.code === 200) {
                context.commit('GETDETAILLIST', result.data);
            }
        },

        // 将产品添加到购物车中 || 修改某个产品数量
        async addOrUpdateShopCart(context,{skuId,skuNum}) {
            // 加入购物车以后(发请求)，前台将参数带给服务器，服务器写入数据后，并没有返回其他数据，只是返回了code=200请求成功的标识，代表操作成功。
            // 因为服务器没有返回其余数据，因此没必要vuex三大步存储数据了。
            const result = await reqAddOrUpdateShopCart(skuId,skuNum);
            // code==200代表加入购物车成功
            if (result.code === 200) {
                return 'ok';
            }else{
                // 代表加入购物车失败
                return Promise.reject(new Error('failure'));
            }
        },
    },
    // mutations是唯一修改state的地方
    mutations: {
        GETDETAILLIST(state,detailList){
            state.detailList=detailList;
        }
    },
    // 计算属性：在项目中，主要是为了简化仓库中的数据而生。
    getters: {
        // 路径导航简化的数据
        categoryView(state){
            // state.detailList的初始状态为空对象，空对象的categoryView不存在，就会导致程序执行没问题，但控制台会报错（假报错）。
            // 解决：所以我们属性值至少得返回一个空对象，假报错就没了。
            return state.detailList.categoryView || {};
        },
        // 产品信息简化的数据
        skuInfo(state){
            return state.detailList.skuInfo || {};
        },
        // 产品售卖属性简化的数据
        spuSaleAttrList(state){
            return state.detailList.spuSaleAttrList || [];
        }

    }
}