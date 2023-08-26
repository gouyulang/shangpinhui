<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(cart, index) in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked" @change="updateChecked(cart, $event)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}.00</span>
          </li>
          <!-- 控制商品数量 -->
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handler('minus', -1, cart)">-</a>
            <input autocomplete="off" type="text" minnum="1" class="itxt" :value="cart.skuNum"
              @change="handler('change', $event.target.value * 1, cart)">
            <a href="javascript:void(0)" class="plus" @click="handler('add', 1, cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <!-- 小计=单价*数量 -->
            <span class="sum">{{ cart.skuPrice * cart.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>

      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked && cartInfoList.length>0" @change="updateAllCartChecked">
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ this.totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from 'lodash/throttle.js';

export default {
  name: 'ShopCart',

  mounted() {
    this.getData();
  },

  methods: {
    // 获取个人购物车数据的函数
    getData() {
      this.$store.dispatch('getShopCartList');
    },

    // 修改某个产品数量 【节流】
    handler: throttle(async function (type, disNum, cart) {
      // type形参：为了区分加，减。和直接修改三种方式
      // disNum形参：有-1,+1，及直接修改后的值 三种取值
      // cart形参：存放着动态数据
      // console.log('派发action,通知服务器修改个数',type,disNum,cart);

      // 修改数据
      switch (type) {
        // 1.加号
        case 'add':
          disNum = 1;
          break;
        // 2.减号
        case 'minus':
          // 判断产品个数大于1，才可以传递给服务器-1。产品个数小于等于1，传递给服务器0，即不变
          disNum = cart.skuNum > 1 ? -1 : 0;
          break;
        // 3.直接修改数据
        case 'change':
          // 先判断用户输入是否合法
          if (isNaN(disNum) || disNum < 1) {
            // （1）如果输入非法（非纯数字或小于1），则不变
            disNum = 0;
          } else {
            // （2）如果输入合法（且要注意取整），则改变
            disNum = parseInt(disNum) - cart.skuNum;
          }
          break;
      }
      // 核心：带给服务器的数据disNum是变化的量。

      // 派发action，通知服务器修改个数（我们这里直接借用之前detail仓库写的addOrUpdateShopCart添加购物车这个方法）
      // 拦截Promise，进行判断。
      try {
        await this.$store.dispatch('addOrUpdateShopCart', { skuId: cart.skuId, skuNum: disNum });
        // 再发一次请求，更新数据
        this.getData();

      } catch (error) {
        // 失败
        alert(error.message);
      }
    }, 1000),

    // 删除购物车某个产品
    async deleteCartById(cart) {
      try {
        // 成功
        await this.$store.dispatch("deleteShopCartById", cart.skuId);
        // 删除成功则再发一次请求 更新页面
        this.getData();
      } catch (error) {
        // 失败
        alert(error.message);
      }
    },

    // 修改购物车某个产品的勾选状态
    async updateChecked(cart, event) {
      try {
        // 成功
        // 带给服务器的isChecked不应该是布尔值，而是0/1，所以需要判断转换
        // console.log(event.target.checked);
        let isChecked = event.target.checked ? '1' : '0';
        await this.$store.dispatch("updateCheckedById", { skuId: cart.skuId, isChecked: isChecked });
        // 修改成功则再发一次请求 更新页面
        this.getData();
      } catch (error) {
        // 失败
        alert(error.message);
      }
    },

    // 删除全部选中的产品
    // 注意：这个回调函数我们没法收集到一些有用的数据，因为不在范围
    async deleteAllCheckedCart() {
      try {
        // 派发一个active
        await this.$store.dispatch('deleteAllCheckedCartList');
        // 再次发请求，更新页面
        this.getData();
      } catch (error) {
        // 失败
        alert(error.message);
      }
    },

    // 全选框一键全选
    // event参数，就算上面没有传，下面函数也可以拿到这个，因为是默认的。
    async updateAllCartChecked(event) {
      try {
        // checked判断全选框是否被勾选
        let isChecked = event.target.checked ? '1' : '0';
        // 派发action
        await this.$store.dispatch('updateAllCartCheckedList', isChecked);
        // 再次发请求，更新页面
        this.getData();
      } catch (error) {
        // 失败
        alert(error.message);
      }
    }

  },

  computed: {
    ...mapGetters(['shopCartlist']),

    // 对shopCartlist再次简化计算一下
    cartInfoList() {
      // 同样，可能会是个空数组，所以要至少是个空数组
      return this.shopCartlist.cartInfoList || [];
    },

    // 计算总价
    totalPrice() {
      let sum = 0;
      this.cartInfoList.forEach(item => {
        sum += item.skuPrice * item.skuNum;
      });
      return sum;
    },

    // 判断是否全部勾选
    isAllChecked() {
      // es5新增：数组方法every()，如果遍历的每一项都为真，则返回真，否则返回假
      return this.cartInfoList.every(item => item.isChecked == 1);
    }
  },

}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      &>div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;

      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        &>li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;

        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>