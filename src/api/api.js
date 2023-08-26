// 当前文件：对api接口统一管理

import requests from './request';
import mockRequests from './mockRequest';

// 三级联动接口
// 地址:/api/product/getBaseCategoryList    请求方式：get请求      是否带参数：无参数
export const reqCategoryList=()=>{
    // 发送请求:axios发请求返回结果为Promise对象
    return requests({
        url:'/product/getBaseCategoryList',
        method:'get',
    })
};

// Banner接口（Home首页轮播图）
export const reqGetBannerList =()=>mockRequests.get('banner');   //注意看两种写法的区别
// export const reqGetBannerList=()=>{
//     return mockRequests({
//         url:'/banner',
//         method:'get',
//     })
// };

// Floor接口（Home首页）
export const reqGetFloorList =()=>mockRequests.get('floor');

// search搜索接口（Search页面） 
// 地址：/api/list     请求方式：POST    是否带参：带参
// 当前这个接口(获取搜索模块的数据)，给服务器传递参数params，至少得是一个空对象。
export const reqGetSearchInfo=(params)=>{
    return requests({
        url:'/list',
        method:'post',
        data:params,
    })
};

// detail详情页面接口（Detail页面）
// 地址：api/item/{skuId}    请求方式：get    是否带参：带参
export const reqGetDetailInfo=(skuId)=>{
    return requests({
        url:`/item/${skuId}`,
        method:'get',
    })
};

// 产品添加到购物车接口（Detail页面）
// 地址：api/cart/addToCart/{skuId}/{skuNum}    请求方式：post    是否带参：带参
export const reqAddOrUpdateShopCart=(skuId,skuNum)=>{
    return requests({
        url:`/cart/addToCart/${skuId}/${skuNum}`,
        method:'post',
    })
};

// 获取购物车列表数据接口（shopcart页面）
// 地址：api/cart/cartList    请求方式：get    是否带参：不带参
export const reqGetShopCartInfo=()=>{
    return requests({
        url:'/cart/cartList',
        method:'get',
    })
};

// 删除购物车列表数据接口（shopcart页面）
// 地址：api/cart/deleteCart    请求方式：delete    是否带参：带参
export const reqDeleteShopCartById=(skuId)=>{
    return requests({
        url:`/cart/deleteCart/${skuId}`,
        method:'delete',
    })
};

// 修改产品选中状态接口（shopcart页面）
// 地址：api/cart/checkCart/{skuId}/{isChecked}    请求方式：get    是否带参：带参
export const reqUpdateCheckedById=(skuId,isChecked)=>{
    return requests({
        url:`/cart/checkCart/${skuId}/${isChecked}`,
        method:'get',
    })
};

// 获取验证码的接口（Register页面）
// 地址：/api/user/passport/sendCode/{phone}    请求方式：get    是否带参：带参
export const reqGetCode=(phone)=>{
    return requests({
        url:`/user/passport/sendCode/${phone}`,
        method:'get',
    })
};

// 用户注册的接口（Register页面）
// 接口地址 /api/user/passport/register   post请求   带参
export const reqUserRegister=(data)=>{
    return requests({
        url:'/user/passport/register',
        method:'post',
        data,
    })
};

// 登录验证的接口（Login页面）
// 接口地址 /api/user/passport/login  post请求   带参
export const reqUserLogin=(data)=>{
    return requests({
        url:'/user/passport/login',
        method:'post',
        data,
    })
};

// 获取用户信息的接口【token】（home页面）
// 接口地址 api/user/passport/auth/getUserInfo   请求方式：get    是否带参：不带参
export const reqUserInfo=()=>{
    return requests({
        url:'/user/passport/auth/getUserInfo',
        method:'get',
    })
};

// 退出登录的接口（header页面） 
// 接口地址 api/user/passport/logout   请求方式：get    是否带参：不带参
export const reqLogout=()=>{
    return requests({
        url:'/user/passport/logout',
        method:'get',
    })
};

// 获取用户地址信息的接口（Trade页面）
// 用户地址信息：/api/user/userAddress/auth/findUserAddressList  get请求   不带参
export const reqAddressInfo=()=>{
    return requests({
        url:'/user/userAddress/auth/findUserAddressList',
        method:'get',
    })
};

// 获取商品清单的接口（Trade页面）
// 商品清单接口：/api/order/auth/trade    get请求   无参数
export const reqOrdersInfo=()=>{
    return requests({
        url:'/order/auth/trade',
        method:'get',
    })
};

// 提交订单的接口（Trade页面-pay页面）
// 提交订单的请求地址:/api/order/auth/submitOrder?tradeNo={tradeNo}  post请求    带参
export const reqSubmitOrder=(tradeNo,data)=>{
    return requests({
        url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,
        method:'post',
        data,
    })
};

// 获取订单支付信息的接口（pay页面）
// 接口地址：/api/payment/weixin/createNative/{orderId}    get请求  带参
export const reqPayInfo=(orderId)=>{
    return requests({
        url:`/payment/weixin/createNative/${orderId}`,
        method:'get',
    })
};

// 获取订单支付状态信息的接口（pay页面）
// 接口地址：/api/payment/weixin/queryPayStatus/{orderId}    get请求  带参
export const reqPayStatus=(orderId)=>{
    return requests({
        url:`/payment/weixin/queryPayStatus/${orderId}`,
        method:'get',
    })
};

// 获取个人中心的我的订单列表的接口（center页面）
// 接口地址：/api/order/auth/{page}/{limit}    get请求  带参
export const reqMyOrderList=(page,limit)=>{    //默认第几页数，每页大小
    return requests({
        url:`/order/auth/${page}/${limit}`,
        method:'get',
    })
};