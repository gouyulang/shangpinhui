// 引入mockjs模块
import Mock from 'mockjs';

// 把json格式数据引入进来【json数据格式根本没有对外暴露，但是我们可以引入】
// 原因：webpack默认对外暴露的有：图片，json格式数据
import banner from './banner.json';
import floor from './floor.json';

// 开始mock模拟数据：第一个参数是请求地址，第二个参数是请求参数
Mock.mock('/mock/banner',{      //模拟首页大轮播图的数据
    code:200,
    data:banner
})
Mock.mock('/mock/floor',{      //模拟首页的数据
    code:200,
    data:floor
})
// 注意：请求地址需要以/mock/开头，不能直接./mock/floor，也不能有fllor.json后缀。


