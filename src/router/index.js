// 配置路由的地方

import Vue from 'vue';
// 引入vue-router
import VueRouter from 'vue-router';
// 引入路由信息文件
import routes from './routes';
// 引入store仓库
import store from '@/store/index';

// 应用插件
Vue.use(VueRouter);

// 重写VueRouter的push/replace方法：
// （1）先把VueRouter原型对象的push保存一份。
// console.log(VueRouter.prototype);
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

// （2）重写push/replace方法
VueRouter.prototype.push = function (location, resolve, reject) {
    // location参数：告诉原来push方法往哪里跳转以及传递那些参数。
    // resolve参数：成功的回调。
    // reject参数：失败的回调。
    if (resolve && reject) {
        // call与apply区别：
        // 相同点：都可以调用函数一次，都可以修改函数的上下文一次。
        // 不同点：call与apply传递的参数不同，call传递参数用逗号隔开，而apply使用数组传递参数。
        originPush.call(this, location, resolve, reject);
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
};
VueRouter.prototype.replace = function () {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject);
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}

// 配置路由
const router = new VueRouter({
    // 配置路由
    routes,
    // 滚动行为
    scrollBehavior(to, from, savedPosition) {
        // return 期望滚动到哪个的位置
        return { y: 0 };    // y=0代表滚动条在最上方，单位为像素
    }
})

// 全局前置守卫--初始化和每次路由切换之前被调用
router.beforeEach(async (to, from, next) => {
    // console.log('beforeEach',to,from);
    // to:可以获取到要跳转到的那个路由信息
    // from:可以获取到从哪个路由开始跳转的路由信息
    // next:放行函数
    // 注意：还可以next('/login')指定放行到那个路由，还有next(false)中断当前导航，会回到from来时的路由地址

    // 问题2：项目中登陆成功后，不应该直接可以进入登录页面，而要先退出登陆
    // 解决：全局前置守卫+token标识登陆状态
    let token = store.state.user.token;    //未登录一定不会有token
    // 用户信息
    // 注意：空对象也为true,所以这应该判断其name是否存在，才能确定是否为空
    let name = store.state.user.userInfo.name;
    // 用户已登陆
    if (token) {
        // 如果登陆了还想去login或者register页面--禁止通行
        if (to.path == '/login' || to.path=='/register') {
            next('/home');
        } else {
            // 登录了，去的不是login或者register
            // 问题1：目前已经解决在Home页面刷新不会取消登陆，但在其他页面刷新页面仍会取消登陆？
            // 解决：name属性判断用户信息userInfo的用户名是否为空
            if (name) {
                next();
            } else {
                // 没有用户信息，则重新派发action，让仓库存储用户信息再跳转
                // 登陆成功后，获取用户账户信息在首页展示
                try {
                    await store.dispatch('getUserInfo');
                    // 存储用户信息成功-则允许跳转
                    next();
                } catch (error) {
                    // token失效了获取不到用户信息--清除token并重新登录
                    await store.dispatch('userLogout');
                    next('/login');
                }
            }
        }
    } else {
        // 问题3：退出登陆后，我们在地址栏输入一些私密网址时，比如购物车地址/shopcart时，页面会直接跳转过去。
        // 解决--day_12
        // 未登录：不能去交易相关（trade）,支付相关（pay,paysuccess），用户中心（center）相关------前往登陆页面
        // 未登录：去的不是上面的地方（比如search,home等）-----放行
        if(to.path=='/trade' || to.path=='/pay' || to.path=='/paysuccess' || to.path.indexOf('/center')!==-1){
            // 把未登录的时候想去而没有去的地址信息存放在地址栏中
            next('/login?redirect='+to.path);
        }else {
            next();
        }

    }
})

export default router;

