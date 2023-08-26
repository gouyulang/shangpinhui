<template>
    <div class="swiper-container" ref="floorSwiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(carousel, index) in carouselList" :key="carousel.id">
                <img :src="carousel.imgUrl">
            </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>
</template>

<script>
// 引入swiper
import Swiper from 'swiper';

export default {
    name: 'Carousel',
    props: ['carouselList'],

    watch: {
        list: {
            // 为什么watch监听不到list?
            // 因为这个数据从来没有发生变化（数据是父组件给的，父组件给的Hi好就是一个对象，对象里的数据是已经有了的）

            // 立即监听：不管数据有没有变化，一开始就执行一次handler()
            immediate: true,
            handler(newValue, oldValue) {
                // console.log('list改变');
                // console.log(newValue,oldValue);

                // 监听需要的数据已经有了，但v-for动态渲染结构我们还是无法确定，因此还需要用nextTick
                this.$nextTick(() => {
                    var swiper = new Swiper(this.$refs.floorSwiper, {
                        //是否循环
                        loop: true,
                        // 如果需要分页器（小圆球）
                        pagination: {
                            el: ".swiper-pagination",
                            // 是否可以点击小圆球
                            clickable: true,
                        },
                        // 如果需要前进后退按钮
                        navigation: {
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        },
                    });
                })
            }
        }
    }

};
</script>

<style lang="less" scoped></style>