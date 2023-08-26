<template>
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(skuImage, index) in skuImageList" :key="skuImage.id">
        <img :src="skuImage.imgUrl" :class="{active:currentIndex==index}" @click="changeCurrentIndex(index)"/>
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import Swiper from 'swiper';

export default {
  name: "ImageList",
  data(){
    return {
      currentIndex:0,
    }
  },
  props: ['skuImageList'],

  methods: {
    changeCurrentIndex(index){
      // 修改响应式数据currentIndex，实现点击谁 谁就出现红框
      this.currentIndex=index;
      // 通知兄弟组件当前的索引值--全局事件总线
      this.$bus.$emit('getCurrentIndex',this.currentIndex);
    }
  },

  watch: {
    // 监听数据;：可以保证数据一定已经准备好，但不能保证结构是否准备好
    skuImageList(newValue, oldValue) {
      // 监听需要的数据已经有了，但v-for动态渲染结构我们还是无法确定，因此还需要用nextTick
      this.$nextTick(() => {
        new Swiper(this.$refs.cur, {
          // 如果需要前进后退按钮
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          // 控制同时显示的轮播图片个数
          slidesPerView:3,
          // 控制每次切换轮播图片的个数
          slidesPerGroup:1,
        });
      });
    }
  },

}
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;

    &::after {
      font-size: 12px;
    }
  }
}
</style>