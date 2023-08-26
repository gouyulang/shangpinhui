// 对外暴露一个函数，封装存储token的方法
export const setToken=(token)=>{
    localStorage.setItem('TOKEN',token);
}
// 对外暴露一个函数，封装获取token的方法
export const getToken=()=>{
    return localStorage.getItem('TOKEN');
}
// 对外暴露一个函数，封装清除token的方法
export const removeToken=()=>{
    return localStorage.removeItem('TOKEN');
}