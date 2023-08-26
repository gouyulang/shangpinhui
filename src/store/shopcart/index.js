import {reqGetShopCartInfo,reqDeleteShopCartById,reqUpdateCheckedById} from '@/api/api';

// shopcart模块的小仓库
export default {
    state:{
        shopCartlist:[],
    },
    // mutations是唯一修改state的地方
    mutations:{
        GETSHOPCARTLIST(state,shopCartlist){
            state.shopCartlist=shopCartlist;
        }
    },
    actions:{
        // 获取购物车列表数据  
        async getShopCartList(context){
            const result = await reqGetShopCartInfo();
            // 将数据存放到state中
            if(result.code===200){
                context.commit('GETSHOPCARTLIST',result.data);
            }
        },
        // 删除购物车某个产品  
        async deleteShopCartById(context,skuId){
            const result = await reqDeleteShopCartById(skuId);
            if(result.code===200){
                return 'ok';
            }else {
                // 代表删除购物车某个产品失败
                return Promise.reject(new Error('failure'));
            }
        },

        // 修改购物车某个产品选中状态
        async updateCheckedById(context,{skuId,isChecked}){
            const result = await reqUpdateCheckedById(skuId,isChecked);
            if(result.code===200){
                return 'ok';
            }else {
                // 代表修改购物车某个产品状态失败
                return Promise.reject(new Error('failure'));
            }
        },

        // 删除全部勾选的产品  
        deleteAllCheckedCartList(context){
            // context不仅有仓库的所有方法，例如dispatch,commit等，还存放了state,getters的所有数据属性。
            // console.log(context);

            // 获取购物车全部的产品
            let cartInfoList=context.getters.shopCartlist.cartInfoList;
            let promiseAll=[];
            cartInfoList.forEach(item => {
                // 遍历数据，筛选出被选中的数据进行删除
                if(item.isChecked==1){
                    // 我们不再新写api，直接复用之前写的接口函数deleteShopCartById
                   var promise= context.dispatch('deleteShopCartById',item.skuId);
                }
                // 将每一次返回的promise添加到数组中
                promiseAll.push(promise);
            });
            // Promise.all([...])全部成功则返回成功，但如果有一个promise失败，则将失败的Promise的错误返回。
            return Promise.all(promiseAll);
        },

        // 修改全选框全部勾选的状态 
        async updateAllCartCheckedList(context,isChecked){
            // context不仅有仓库的所有方法，例如dispatch,commit等，还存放了state,getters的所有数据属性。
            // console.log(context,isChecked);

            // 获取购物车全部的产品
            let cartInfoList=context.getters.shopCartlist.cartInfoList;
            let promiseAll=[];
            cartInfoList.forEach(item => {
                // 我们不再新写api，直接复用之前写的接口函数updateCheckedById
                let promise=context.dispatch('updateCheckedById',{skuId:item.skuId,isChecked:isChecked});
                // 将每一次返回的promise添加到数组中
                promiseAll.push(promise);
            });
            // Promise.all([...])全部成功则返回成功，但如果有一个promise失败，则将失败的Promise的错误返回。
            return Promise.all(promiseAll);
        },
    },
    getters:{
        // 把数据简化一下
        shopCartlist(state){
            // 这才是我们想要的购物车数据的所在的数组
            // state.shopCartlist[0]的初始状态为空对象，空对象的cartInfoList不存在，就会导致程序执行没问题，但控制台会报错（假报错）。
            // 解决：所以我们属性值至少得返回一个空对象，假报错就没了。
            return state.shopCartlist[0] || {};
        },
    }
}
