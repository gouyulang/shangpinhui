import { reqGetCode,reqUserRegister,reqUserLogin,reqUserInfo,reqLogout } from '@/api/api';

// 持久化存储token的方法
import {setToken,getToken,removeToken} from '@/utils/token';

// 登陆与注册并用的模块
export default {
    state: {
        code:'',
        // token:localStorage.getItem('TOKEN'),
        token:getToken(),
        userInfo:{},
    },
    actions: {
        // 获取验证码
        async getCodeNumber(context,phone){
            // 获取验证码的这个接口，把验证码返回来，但是正常情况，后台应该把验证码发到用户手机上
            const result= await reqGetCode(phone);
            // console.log(result);
            if (result.code === 200) {
                context.commit('GETCODENUMBER', result.data);
                return 'ok';
            }else {
                // 代表发送验证码失败
                return Promise.reject(new Error('failure'));
            }
        },

        // 用户注册
        async userRegister(context,user){
            const result= await reqUserRegister(user);
            // console.log(result);
            if (result.code === 200) {
                return 'ok';
            }else {
                // 代表用户注册失败
                return Promise.reject(new Error('failure'));
            }
        },

        // 用户登陆 【token】
        async userLogin(context,user){
            const result= await reqUserLogin(user);
            // console.log(result);

            // 服务器下发token,作为用户唯一标识符(类似于uuid)。将来经常通过带token找服务器要用户信息进行展示。
            if (result.code === 200) {
                // 用户已经登陆成功，且获取到token
                context.commit('USERLOGIN', result.data.token);
                // 本地持久化存储token
                // localStorage.setItem('TOKEN',result.data.token);
                setToken(result.data.token);

                return 'ok';
            }else {
                // 代表登陆失败
                return Promise.reject(new Error('failure'));
            }
        },

        // 获取用户信息
        async getUserInfo(context){
            const result= await reqUserInfo();
            // console.log(result);

            // 通过带token找服务器要用户信息进行展示。
            if (result.code === 200) {
                // 提交用户信息
                context.commit('GETUSERINFO', result.data);
                return 'ok';
            }else {
                return Promise.reject(new Error('failure'));
            }
        },

        // 退出登录
        async userLogout(context){
            const result= await reqLogout();
            // console.log(result);

            // 退出成功，则删除本地存储的token与vuex仓库相关数据
            if (result.code === 200) {
                // 删除用户信息数据
                context.commit('CLEAR');
                // 退出成功。返回Home首页
                return 'ok';
            }else {
                return Promise.reject(new Error('failure'));
            }
        }

    },
    // mutations是唯一修改state的地方
    mutations: {
        GETCODENUMBER(state,code){
            state.code=code;
        },
        USERLOGIN(state,token){
            state.token=token;
        },
        GETUSERINFO(state,userInfo){
            state.userInfo=userInfo;
        },
        // 退出成功，清除数据
        CLEAR(state){
            state.token='';
            state.userInfo={};
            // 清除本地存储token--同样我们将这个方法封装一下
            // localStorage.removeItem('TOKEN');
            removeToken();
        },

    },
    getters: {
    }
}
