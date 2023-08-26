<template>
    <div>
        <!-- 三级联动全局组件：在使用时不需要引入即可使用。 -->
        <TypeNav />
        <ListContainer />
        <Recommend />
        <Rank />
        <Like />
        <!-- Floor这个组件，自己在组件内部是没有发请求的，数据是父组件给的。 -->
        <Floor v-for="(floor,index) in floorList" :key="floor.id" :list="floor"/>
        <Brand />
    </div>
</template>

<script>
// 引入其余组件
import ListContainer from '@/pages/Home/ListContainer';
import Recommend from '@/pages/Home/Recommend';
import Rank from '@/pages/Home/Rank';
import Like from '@/pages/Home/Like';
import Floor from '@/pages/Home/Floor';
import Brand from '@/pages/Home/Brand';

import { mapState } from 'vuex';

export default {
    name: 'MyHome',
    components:{
        ListContainer,
        Recommend,
        Rank,
        Like,
        Floor,
        Brand
    },

    mounted(){
        //派发actions，获取floor组件的数据
        this.$store.dispatch('getFloorList');
    },

    computed:{
        ...mapState({
            floorList:state=>state.home.floorList
        })
    }

};
</script>

<style scoped>

</style>