<template>
    <!-- 头部 -->
    <header class="header">
        <!-- 头部的第一行 -->
        <div class="top">
            <div class="container">
                <div class="loginList">
                    <p>尚品汇欢迎您！</p>
                    <!-- 没有用户名，未登录 -->
                    <p v-if="!userName">
                        <span>请</span>
                        <!-- 声明式导航: vue会自动把router-link标签转换为a标签。 -->
                        <router-link to="/login">登陆</router-link>
                        <router-link to="/register" class="register">免费注册</router-link>
                    </p>
                    <!-- 有用户名，登陆成功，并显示用户名信息 -->
                    <p v-else>
                        <a>{{ userName }}</a>
                        <a class="register" @click="logout">退出登录</a>
                    </p>
                </div>
                <div class="typeList">
                    <router-link to="/center/myorder">我的订单</router-link>
                    <router-link to="/shopcart">我的购物车</router-link>
                    <a href="###">我的尚品汇</a>
                    <a href="###">尚品汇会员</a>
                    <a href="###">企业采购</a>
                    <a href="###">关注尚品汇</a>
                    <a href="###">合作招商</a>
                    <a href="###">商家后台</a>
                </div>
            </div>
        </div>
        <!--头部第二行 搜索区域-->
        <div class="bottom">
            <h1 class="logoArea">
                <!-- 声明式导航: vue会自动把router-link标签转换为a标签。 -->
                <router-link to="/home" class="logo">
                    <img src="./images/logo.png" alt="">
                </router-link>
            </h1>
            <div class="searchArea">
                <form action="###" class="searchForm">
                    <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="keyword" />
                    <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">
                        搜索
                    </button>
                </form>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'MyHeader',
    data() {
        return {
            keyword: ''
        }
    },
    methods: {
        // 搜索按钮的回调函数，需要向Search路由进行跳转。
        goSearch() {
            // 路由传递参数：
            // 第一种：字符串形式
            // this.$router.push('/search/'+this.keyword+'?key='+this.keyword.toUpperCase());
            // 第二种：模板字符串
            // this.$router.push(`/search/${this.keyword}?key=${this.keyword.toUpperCase()}`);
            // 第三种写法：对象写法（常用）
            let location = {
                name: 'search',
                params: {
                    keyword: this.keyword || undefined
                }
            }
            if (this.$route.query) {
                // 判断：如果路由跳转的时候，带有query参数，一起传递过去
                location.query = this.$route.query;

                // 路由跳转与传参
                this.$router.push(location);
            }



            // ************************路由传参常考面试题************************************
            // 面试题1：路由传递参数（对象写法）path是否可以结合params参数一起使用?
            // this.$router.push({path:'/search',params:{keyword:this.keyword},query:{key:this.keyword.toUpperCase()}});
            // 答：路由跳转传参的时候，对象的写法可以使name,path形式，但需要注意点是，path这种写法不能和params参数一起使用。

            // 面试题2：如何指定params参数可传可不传?
            // this.$router.push({name:'search',query:{key:this.keyword.toUpperCase()}});
            // 答：如果路由要求传递params参数，但是我们就不传递params参数，就会发现URL会出现问题。
            // 答：可以在配置路由的时候，在占位的后面加上一个问号：path:'/search/:keyword?'

            // 面试题3;params参数可以传递也可以不传递，但是如果传递是空串，如何解决？
            // this.$router.push({name:'search',params:{keyword:''||undefined},query:{key:this.keyword.toUpperCase()}});
            // 答：使用undefined解决。params参数可以传递，也可以不传递或空串。

            // 面试题4：路由组件能不能传递props数据?
            // 答：可以，且有三种写法。在路由器路由中配置。

        },

        // 退出登陆
        logout(){
            // 1.需要发请求，通知服务器退出登陆（清除一些数据，token）
            // 2.清除项目中的一些数据（userInfo，token等）
            try {
                this.$store.dispatch('userLogout');
                // 如果退出成功，则回到首页
                this.$router.push('/home');
            } catch (error) {
                alert(error.message);
            }
        }
    },

    mounted(){
        // 通过全局事件总线清除关键字
        this.$bus.$on('clear',()=>{
            this.keyword='';
        })
    },

    computed:{
        // 用户名信息
        userName(){
            return this.$store.state.user.userInfo.name;
        },
    }
};
</script>

<style lang='less' scoped>
/* 头部 */
.header {
    &>.top {
        background-color: #eaeaea;
        height: 30px;
        line-height: 30px;

        .container {
            width: 1200px;
            margin: 0 auto;
            overflow: hidden;

            .loginList {
                float: left;

                p {
                    float: left;
                    margin-right: 10px;

                    .register {
                        border-left: 1px solid #b3aeae;
                        padding: 0 5px;
                        margin-left: 5px;
                    }
                }
            }

            .typeList {
                float: right;

                a {
                    padding: 0 10px;

                    &+a {
                        border-left: 1px solid #b3aeae;
                    }
                }

            }

        }
    }

    &>.bottom {
        width: 1200px;
        margin: 0 auto;
        overflow: hidden;

        .logoArea {
            float: left;

            .logo {
                img {
                    width: 175px;
                    margin: 25px 45px;
                }
            }
        }

        .searchArea {
            float: right;
            margin-top: 35px;

            .searchForm {
                overflow: hidden;

                input {
                    box-sizing: border-box;
                    width: 490px;
                    height: 32px;
                    padding: 0px 4px;
                    border: 2px solid #ea4a36;
                    float: left;

                    &:focus {
                        outline: none;
                    }
                }

                button {
                    height: 32px;
                    width: 68px;
                    background-color: #ea4a36;
                    border: none;
                    color: #fff;
                    float: left;
                    cursor: pointer;

                    &:focus {
                        outline: none;
                    }
                }
            }
        }
    }
}
</style>