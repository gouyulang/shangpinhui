import { reqAddressInfo,reqOrdersInfo } from '@/api/api';

// 交易模块的仓库
export default {
    state: {
        // 用户地址信息
        address:[],
        // 商品清单信息
        orderInfo:{},
    },
    actions: {
        // 获取用户地址信息
        async getUserAddress(context) {
            const result = await reqAddressInfo();
            // console.log(result);

            // 通过带token找服务器要用户信息进行展示。
            if (result.code === 200) {
                // 提交用户信息
                context.commit('GETUSERADDRESS', result.data);
                return 'ok';
            } 
            else {
                return Promise.reject(new Error('failure'));
            }
        },

        // 获取商品清单信息
        async getGoodsOrder(context) {
            const result = await reqOrdersInfo();
            // console.log(result);

            // 通过带token找服务器要用户信息进行展示。
            if (result.code === 200) {
                // 提交用户信息
                context.commit('GETGOODSORDER', result.data);
                return 'ok';
            } 
            else {
                return Promise.reject(new Error('failure'));
            }
        },
    },
    // mutations是唯一修改state的地方
    mutations: {
        GETUSERADDRESS(state,address){
            state.address=address;
        },
        GETGOODSORDER(state,orderInfo){
            state.orderInfo=orderInfo;
        },
    },
    getters: {
    }
}
