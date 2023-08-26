// 生成临时身份的地方

import {v4 as uuidv4} from 'uuid';
// 要生成一个随机字符串，且每次执行不能发生变化，游客身份持久存储---本地存储localStorage。
export const getUUID=()=>{
    // 先从本地存储获取uuid（看一下本地存储里面是否有）
    let uuid_token=localStorage.getItem('UUIDTOKEN');
    // 如果没有，则生成
    if(!uuid_token){
        // 生成游客临时身份
        uuid_token=uuidv4();
        // 本地存储 存储一次
        localStorage.setItem('UUIDTOKEN',uuid_token);
    }
    // 切记：必须有返回值
    return uuid_token;
}