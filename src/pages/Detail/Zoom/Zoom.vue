<template>
  <div class="spec-preview">
    <!-- 左侧原图 -->
    <img :src="skuImgObj.imgUrl" />
    <div class="event" @mousemove="handler"></div>

    <!-- 右侧大图 -->
    <div class="big">
      <img :src="skuImgObj.imgUrl" ref="big"/>
    </div>
    <!-- 遮罩层 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>

export default {
  name: "Zoom",
  data(){
    return {
      index:0,
    }
  },
  props: ['skuImageList'],

  mounted(){
    // 接收兄弟组件的全局事件总线发来的索引值
    this.$bus.$on('getCurrentIndex',(index)=>{
      // 修改当前的索引值
      this.index=index;
    })
  },

  methods:{
    // 鼠标移动触发事件
    handler(event){
      // （1）获取遮罩层标签和大图标签的DOM元素
      let mask=this.$refs.mask;
      let big=this.$refs.big;

      // （2）获取遮罩层中心的坐标left与top
      let left=event.offsetX-mask.offsetWidth/2;      // =鼠标x坐标-盒子宽度
      let top=event.offsetY-mask.offsetHeight/2;      // =鼠标y坐标-盒子高度

      // （3）约束遮罩层的范围
      if(left<=0) left=0;
      if(left>mask.offsetWidth) left=mask.offsetWidth;
      if(top<=0) top=0;
      if(top>mask.offsetHeight) top=mask.offsetHeight;

      // （4）修改遮罩层元素的left、top属性值
      mask.style.left=left+'px';
      mask.style.top=top+'px';

      // （5）修改大图的left、top属性值
      big.style.left=-2*left+'px';    //我们查看css可知，大图是同比放大2倍
      big.style.top=-2*top+'px';     
    }
  },

  computed:{
    //子组件中对数据再加工--zoom组件
    skuImgObj(){
      // 如果服务器的数据没有回来。skuImgObj这个对象就是空对象，防止控制台假报错。
      return this.skuImageList[this.index] || {};
    }
  },



}
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover~.mask,
  .event:hover~.big {
    display: block;
  }
}
</style>