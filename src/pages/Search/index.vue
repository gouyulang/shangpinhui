<template>
  <div>
    <!-- 这是Search模块 -->
    <!-- 三级联动全局组件：在使用时不需要引入即可使用。 -->
    <TypeNav />

    <div class="main">
      <div class="py-container">
        <!--bread：面包屑，带有x的结构的-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName }}
              <i @click="removeCategoryName">×</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}
              <i @click="removeKeyword">×</i>
            </li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1] }}
              <i @click="removeTrademark">×</i>
            </li>
            <!-- 平台售卖属性值的面包屑 -->
            <li class="with-x" v-for="(attr,index) in searchParams.props" :key="index">
              {{ attr.split(":")[1] }}
              <i @click="removeAttrValue(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector：-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrValueInfo="attrValueInfo"/>

        <!--details-->
        <div class="details clearfix">
          <!-- 筛选结构 -->
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 排序的结构选择 -->
              <ul class="sui-nav">
                <li :class="{'active':isOne}" @click="changeOrder('1')">
                  <a>综合 
                    <span v-show="isOne" 
                    class="iconfont" 
                    :class="{'icon-up-arrow':isAsc,'icon-down-arrow':isDesc}">
                  </span>
                  </a>
                </li>
                <li :class="{'active':isTwo}" @click="changeOrder('2')">
                  <a>价格 
                    <span v-show="isTwo" 
                    class="iconfont" 
                    :class="{'icon-down-arrow':isDesc,'icon-up-arrow':isAsc}">
                  </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="(goods, index) in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 跳转到详情页面的地方，还要带params参数 -->
                    <router-link :to="`/detail/${goods.id}`">
                      <img v-lazy="goods.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{ goods.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">
                      {{ goods.title }}
                    </a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination :pageNo="searchParams.pageNo" :pageSize="searchParams.pageSize" :total="total" :continues="5" @getPageNo="getPageNo"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector';
import { mapGetters,mapState } from 'vuex';

export default {
  name: 'Search',

  data() {
    return {
      searchParams: {
        // 一级分类的id
        category1Id: "",
        // 二级分类的id
        category2Id: "",
        // 三级分类的id
        category3Id: "",
        // 分类名字
        categoryName: "",
        // 关键字
        keyword: "",
        // 平台售卖属性操作带的参数
        props: [],
        // 品牌
        trademark: "",
        // 排序：初始值为综合:降序
        order: "1:desc",
        // 分页器，代表当前第几页
        pageNo: 1,
        // 代表每一页展示数据个数
        pageSize: 5,
      },
    };
  },

  components: {
    SearchSelector
  },

  // 组件挂载完毕之前执行一次beforeMount()，我们就可以实时修改参数
  beforeMount() {
    // console.log(this.$route.query);
    // 在发请求之前，把接口需要传递的数据，进行整理（在给服务器发请求之前，把参数整理好，服务器就会返回查询的数据）
    // 复杂的写法
    // this.searchParams.category1Id=this.$route.query.category1Id;
    // this.searchParams.category2Id=this.$route.query.category2Id;
    // this.searchParams.categoryName=this.$route.query.categoryName;
    // ...
    // 简单的写法: Object.assign() es6新增语法，合并对象
    Object.assign(this.searchParams,this.$route.params,this.$route.query);
  },

  mounted() {
    // 在发起请求之前带给服务器参数（searchParams参数优质带给服务器）
    // 发请求
    // 两个都可以写，也可以只写其中一个。注意：category3Id不可以这样做
    this.searchParams.category1Id = undefined;
    // this.searchParams.category2Id = undefined;
    this.getData();
  },

  methods: {
    // 向服务器发请求获取search模块数据（根据参数不同返回不同的数据进行展示）
    // 把这次请求封装为一个函数，当需要发送请求时调用即可
    getData() {
      this.$store.dispatch("getSearchList", this.searchParams);
    },

    // 删除面包屑分类的名字
    removeCategoryName() {
      this.searchParams.categoryName = undefined;
      // 把带给服务器的参数置空了，还需要向服务器发请求，并且置空相关id
      // 优化：其实置空并不好，从服务器的角度看，采用undefined可以减轻服务器负担。
      // 带给服务器参数这里是可有可无的，如果属性值为空的字符串还是会把相应的字段带给服务器，但是如果把相应的字段变为undefined，当前这个字段就不会带给服务器
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.getData();
      // 地址栏也需要做修改（让地址栏的query参数也删除，但不删除params参数）
      // 办法：进行路由跳转
      if (this.$route.params) {
        this.$router.push({
          name: 'search',     // 自己跳转到自己页面，但没有query参数
          params: this.$route.params
        });
      }
    },

    // 删除面包屑关键字
    removeKeyword() {
      // 把给服务器带的参数searchParams的keyword置为undefined
      this.searchParams.keyword = undefined;
      // 还需要向服务器发请求
      this.getData();

      // 当面包屑中的kryword关键字清除以后，需要让兄弟组件header组件中的keyword关键字清除。
      // 使用事件总线：
      this.$bus.$emit('clear');

      // 同样修改地址栏（让地址栏的params数也消失）：方法=>进行路由跳转
      if (this.$route.query) {
        this.$router.push({
          name: 'search',     // 自己跳转到自己页面，但没有params参数
          query: this.$route.query
        });
      }
    },

    // 处理面包屑品牌信息的自定义事件回调函数
    trademarkInfo(trademark){
      // 整理参数，发送请求
      // （1）整理品牌字段参数。样式："ID:品牌名称"
      this.searchParams.trademark=`${trademark.tmId}:${trademark.tmName}`;
      // （2）再次发送请求
      this.getData();
    },

    // 删除面包屑品牌信息
    removeTrademark(){
      this.searchParams.trademark=undefined;
      // 再次发生请求
      this.getData();
    },

    // 收集平台售卖属性的信息
    attrValueInfo(attr,attrValue){
      // 整理售卖属性字段参数。props样式：["属性ID:属性值:属性名"]
      const props=`${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 数组去重
      // indexOf()方法 ，用于查找给定数组元素的第一个索引号，是从前面开始查找，查不到返回-1，查到返回索引号
      if(this.searchParams.props.indexOf(props)==-1){
        this.searchParams.props.push(props);
      }
      // 再次发送请求
      this.getData();
    },

    // 删除面包屑售卖属性信息
    removeAttrValue(index){
      // 删除数组元素splice()
      this.searchParams.props.splice(index,1);
      // 再次发生请求
      this.getData();
    },

    // 控制箭头设置升序还是降序
    changeOrder(flag){
      // flag参数：这是一个标记，代表用户点击的是综合1，还是价格2。 初识order: "1:desc"
      // 获取order的初始状态，我们需要通过初始状态去判断接下来该做什么。
      let originOrder=this.searchParams.order;
      // originFlag,originSort存放的是初识的排序状态
      let originFlag=originOrder.split(':')[0];
      let originSort=originOrder.split(':')[1];
      // 新的排序方式
      let newOrder='';
      // 判断点击的是综合1，还是价格2
      if(flag==originFlag){   
        newOrder=`${originFlag}:${originSort=='desc'?'asc':'desc'}`;
      }else{
        // 选择新的分类排序，默认为desc
        newOrder=`${flag}:${'desc'}`;
      }
      // 将新的neworder赋予searchParams
      this.searchParams.order=newOrder;
      // 再次发送请求
      this.getData();
    },

    // 自定义事件-获取当前第几页
    getPageNo(pageNo){
      // 整理带给服务器的参数
      this.searchParams.pageNo=pageNo;
      // 再次发请求
      this.getData();
    }
  },

  computed: {
    // mapGetters里面的写法：数组。并且getters计算不区分home,search仓库
    ...mapGetters(['goodsList']),
    // 控制类名active的显示
    isOne(){
      return this.searchParams.order.indexOf('1')!=-1;
    },
    isTwo(){
      return this.searchParams.order.indexOf('2')!=-1;
    },
    // 控制箭头类名的显示
    isAsc(){
      return this.searchParams.order.indexOf('asc')!=-1;
    },
    isDesc(){
      return this.searchParams.order.indexOf('desc')!=-1;
    },

    // 获取search模块展示产品一个有多少数据
    ...mapState({
      // 获取search仓库的数据
      total:state=>state.search.searchList.total
    })
  },

  // 数据监听：监听组件实例身上的属性的属性值变化
  watch: {
    // 监听路由的信息是否发生变化
    $route(newValue, oldValue) {
      // console.log(newValue, oldValue);

      // 每一次请求完毕，该把相应的1，2,3级分类的id置空，让它接受下一次的响应的1,2,3级id
      // 而分类名字与关键字不用清理，因为每一次路由发生变化的时候，都会给它赋予新的数据
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;

      // 再次发请求之前整理带给服务器的参数
      Object.assign(this.searchParams,this.$route.params,this.$route.query);
      // 再次发起ajax请求
      this.getData();

    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>