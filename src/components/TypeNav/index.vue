<template>
    <!-- 商品分类导航 -->
    <div class="type-nav">
        <div class="container">
            <!-- 事件委托 -->
            <div @mouseleave="leaveShow" @mouseenter="enterShow">
                <h2 class="all">全部商品分类</h2>
                <!-- 过渡动画 -->
                <transition name="sort">
                    <!-- 三级联动 -->
                    <div class="sort" v-show="show">
                        <!-- 利用事件委托+编程式导航 实现路由跳转与参数传递 -->
                        <div class="all-sort-list2" @click="goSearch">
                            <div class="item " v-for="(c1, index) in categoryList" :key="c1.categoryId"
                                :class="{ cur: currentIndex == index }">
                                <h3 @mouseenter="changeIndex(index)">
                                    <!-- 自定义属性 -->
                                    <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryName">{{
                                        c1.categoryName }}</a>
                                </h3>
                                <!-- 二级，三级分类 -->
                                <div class="item-list clearfix"
                                    :style="{ display: currentIndex === index ? 'block' : 'none' }">
                                    <div class="subitem" v-for="(c2, index) in c1.categoryChild" :key="c2.categoryId">
                                        <dl class="fore">
                                            <dt>
                                                <a :data-categoryName="c2.categoryName"
                                                    :data-category2Id="c2.categoryName">{{ c2.categoryName }}</a>
                                            </dt>
                                            <dd>
                                                <em v-for="(c3, index) in c2.categoryChild" :key="c3.categoryId">
                                                    <a :data-categoryName="c3.categoryName"
                                                        :data-category3Id="c3.categoryName">{{ c3.categoryName }}</a>
                                                </em>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>

            </div>
            <nav class="nav">
                <a href="###">服装城</a>
                <a href="###">美妆馆</a>
                <a href="###">尚品汇超市</a>
                <a href="###">全球购</a>
                <a href="###">闪购</a>
                <a href="###">团购</a>
                <a href="###">有趣</a>
                <a href="###">秒杀</a>
            </nav>

        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
// 这种引入方式：是把lodash全部功能函数引入，但我们需要的其实是按需引入。
// import _ from 'lodash';
// 按需引入
import throttle from 'lodash/throttle.js';

export default {
    name: 'TypeNav',

    data() {
        return {
            // 存储用户鼠标移上哪一个以及分类。初始值为-1，代表谁也没被选择
            currentIndex: -1,
            // 控制显示与隐藏
            show: true
        }
    },

    // 当组件挂载完毕，可以向服务器发请求
    mounted() {

        // 当组件挂载完毕，让show变为false，起到显示与隐藏的效果
        // 如果不是Home路由组件，将TypeNav进行隐藏
        if (this.$route.path != '/home') {
            this.show = false;
        }
    },
    computed: {
        ...mapState({
            // 右侧需要的是一个函数，当使用这个计算属性的时候，右侧函数会立即执行一次。
            categoryList: (state) => {
                // state参数，即为大仓库中的所有数据，包含小仓库的数据
                // console.log(state);
                return state.home.categoryList;
            }
        })
    },

    methods: {
        // 鼠标进入一级分类修改响应式数据currentIndex属性
        // 节流
        // throttle回调函数别用箭头函数，可能出现上下文this指向问题
        changeIndex: throttle(function (index) {
            // index:鼠标移上某一个以及分类的元素索引值

            // 正常情况（用户慢慢操作）：鼠标进入，每一个一级分类h3，都会触发鼠标进入事件。
            // 非正常情况（用户操作很快）：本身全部的一级分类都应该触发鼠标进入事件，但是经过测试，只有部分h3触发了。
            // 就是由于用户行为过快，导致浏览器反应不过来，如果当前回调函数中有一些大量业务，有可能出现卡顿现象。
            // 解决：防抖/节流
            this.currentIndex = index;
        }, 50),

        // 鼠标离开一级分类，将响应式数据currentIndex属性变为-1
        // 当鼠标离开的时候，让商品分类列表进行隐藏
        leaveShow() {
            this.currentIndex = -1;
            // 判断如果是Search组件的时候，才会执行功能：当鼠标离开的时候，让商品分类列表进行隐藏
            if (this.$route.path != '/home') {
                this.show = false;
            }

        },

        // 进行路由跳转的方法
        goSearch(event) {
            // 最好的解决方案：就是利用编程式导航+事件委托
            // 但利用事件委托存在的问题：1.如何如何确定点击的一定是a标签？ 2.如何获取参数？(1,2,3级分类的产品名字等参数)

            // 解决问题1：把子节点中a标签，加上自定义属性data-categoryName，其余子节点是没有的。
            // 节点有一个属性dataset属性，可以获取到节点的自定义属性与属性值。
            let node = event.target;
            // dataset是一个集合里面存放了所有以data开头的自定义属性
            // console.log(node.dataset);
            // 如果标签上有categoryName属性，一定是a标签。（自定义属性自动识别为全部小写）
            let { categoryname, category1id, category2id, category3id } = node.dataset;
            if (categoryname) {
                // 整理路由跳转的参数
                let location = {
                    name: 'search',
                    query:{
                        categoryName: categoryname
                    }
                };

                // 问题2：区分一级分类，二级分类，三级分类的a标签？
                // 解决问题2：把子节点中a标签，加上自定义属性data-category1Id，data-category2Id，data-category3Id，其余子节点是没有的。
                // 如果标签上有category1id属性，一定是一级分类a标签，其他类似。
                if (category1id) {
                    location.query.category1Id = category1id;
                } else if (category2id) {
                    location.query.category2Id = category2id;
                } else {
                    location.query.category3Id = category3id;
                }

                // 整理完参数
                // 判断：如果路由跳转的时候，带有params参数，一起传递过去
                if (this.$route.params.keyword) {
                    location.params = this.$route.params;
                }
                // 路由跳转与传参
                this.$router.push(location);

            }
        },

        // 当鼠标移入的时候，让商品分类列表进行展示
        enterShow() {
            // 判断如果是Search组件的时候，才会执行功能：当鼠标进入的时候，让商品分类列表进行显示
            if (this.$route.path != '/home') {
                this.show = true;
            }
        }
    }

};
</script>

<style lang="less" scoped>
.type-nav {
    border-bottom: 2px solid #e1251b;

    .container {
        width: 1200px;
        margin: 0 auto;
        display: flex;
        position: relative;

        .all {
            width: 210px;
            height: 45px;
            background-color: #e1251b;
            line-height: 45px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
        }

        .nav {
            a {
                height: 45px;
                margin: 0 22px;
                line-height: 45px;
                font-size: 16px;
                color: #333;
            }
        }

        .sort {
            position: absolute;
            left: 0;
            top: 45px;
            width: 210px;
            height: 461px;
            position: absolute;
            background: #fafafa;
            z-index: 999;

            .all-sort-list2 {
                .item {
                    h3 {
                        line-height: 30px;
                        font-size: 14px;
                        font-weight: 400;
                        overflow: hidden;
                        padding: 0 20px;
                        margin: 0;

                        a {
                            color: #333;
                        }
                    }

                    .item-list {
                        display: none;
                        position: absolute;
                        width: 734px;
                        min-height: 460px;
                        background: #f7f7f7;
                        left: 210px;
                        border: 1px solid #ddd;
                        top: 0;
                        z-index: 9999 !important;

                        .subitem {
                            float: left;
                            width: 650px;
                            padding: 0 4px 0 8px;

                            dl {
                                border-top: 1px solid #eee;
                                padding: 6px 0;
                                overflow: hidden;
                                zoom: 1;

                                &.fore {
                                    border-top: 0;
                                }

                                dt {
                                    float: left;
                                    width: 54px;
                                    line-height: 22px;
                                    text-align: right;
                                    padding: 3px 6px 0 0;
                                    font-weight: 700;
                                }

                                dd {
                                    float: left;
                                    width: 415px;
                                    padding: 3px 0 0;
                                    overflow: hidden;

                                    em {
                                        float: left;
                                        height: 14px;
                                        line-height: 14px;
                                        padding: 0 8px;
                                        margin-top: 5px;
                                        border-left: 1px solid #ccc;
                                    }
                                }
                            }
                        }
                    }

                    // &:hover {
                    //     .item-list {
                    //         display: block;
                    //     }
                    // }
                }

                // 当等式成立的时候，给标签加上cur的类名。
                .cur {
                    background-color: skyblue;
                }
            }
        }

        // 过渡动画的样式
        // 过渡动画开始状态（进入）
        .sort-enter {
            height: 0;
        }

        // 过渡动画结束状态（进入）
        .sort-enter-to {
            height: 461px;
        }

        // 定义动画的样式（时间，速率）
        .sort-enter-active {
            transition: all 0.5s linear;
        }
    }
}</style>