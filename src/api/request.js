// 对于axios进行二次封装

import axios from 'axios';
// 引入进度条nprogress
import nprogress from 'nprogress';
// nprogress的方法：start()代表进度条开始,done()代表进度条结束。
// 引入进度条样式
import 'nprogress/nprogress.css';
// 引入仓库
import store from '@/store';

// 1.利用axios对象上的方法create,去创建一个axios实例。
const requests=axios.create({    //requests就是axios，只不过稍微配置一下
    // 配置对象
    // baseURL 含义：请求的域名，基本地址，发送请求时，路径中会自动带有/api。
    baseURL:'/api',
    // timeout 含义：请求超时时长，单位ms
    timeout:5000
})

// 2.请求拦截器：请求拦截器可以在请求之前可以处理一些业务。
requests.interceptors.request.use((config)=>{
    // config为配置对象.该对象中有一个属性很重要，就是header请求头。

    // 如果store里面有uuid_token
    if(store.state.detail.uuid_token){
        // 给请求头添加一个字段userTempId，作为用户临时id
        config.headers.userTempId=store.state.detail.uuid_token;
    }

    // 如果store里面有token
    if(store.state.user.token){
        // 给请求头添加一个字段token，作为用户标识
        config.headers.token=store.state.user.token;
    }

    // 进度条开始动
    nprogress.start();

    return config;

})

// 3.响应拦截器：响应拦截器可以在响应之后，当服务器数据返回时，可以处理一些业务。
requests.interceptors.response.use((response)=>{
    // response为配置对象.该对象中有一个属性很重要，就是header请求头。
    
    // 进度条结束
    nprogress.done();

    return response.data;

},(error)=>{
    // 服务器响应失败的回调函数
    return Promise.reject(new Error('Failure'));
})

// 对外暴露
export default requests;