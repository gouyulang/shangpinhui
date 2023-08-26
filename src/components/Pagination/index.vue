<template>
    <div class="pagination">
        <!-- 上面部分 -->
        <button :disabled="pageNo==1" @click="$emit('getPageNo',pageNo-1)">上一页</button>
        <button 
            v-if="startAndEndNum.start>1" 
            @click="$emit('getPageNo',1)" 
            :class="{active:pageNo==1}"
        >
           1
        </button>
        <button v-if="startAndEndNum.start>2">···</button>

        <!-- 中间部分 -->
        <button 
            v-for="(page,index) in startAndEndNum.end" 
            :key="index" 
            v-if="page>=startAndEndNum.start" 
            @click="$emit('getPageNo',page)"
            :class="{active:pageNo==page}"
        >
            {{ page }}
        </button>

        <!-- 下面部分 -->
        <button v-if="startAndEndNum.end<totalPage-1">···</button>
        <button 
            v-if="startAndEndNum.end<totalPage"  
            @click="$emit('getPageNo',totalPage)" 
            :class="{active:pageNo==totalPage}"
        >
            {{ totalPage }}
        </button>
        <button :disabled="pageNo==totalPage" @click="$emit('getPageNo',pageNo+1)">下一页</button>

        <button style="margin-left: 30px">共 {{ total }} 条</button>
    </div>
</template>
  
<script>
export default {
    name: "Pagination",
    props:['pageNo','pageSize','total','continues'],

    computed:{
        // 计算总共页数
        totalPage(){
            // Math.ceil() 向上取整
            return Math.ceil(this.total/this.pageSize);
        },

        // 计算连续页码的起始数字与结束数字 
        startAndEndNum(){
            // 解构赋值
            const {continues,pageNo,totalPage} = this;
            // 定义两个变量存储起始数字与结束数字
            let start=0,end=0;
            // 连续页码为5，即总页数至少5页，如果出现少于5页，需要另做处理。
            if(continues>totalPage){     //（1）当总页数小于连续页码数
                start=1;
                end=totalPage;
            }else{                       //（2）正常现象：总页数大于等于连续页码数
                // 往前减几和往后加几需要根据连续页码数来判断
                start=pageNo-parseInt(continues/2);    // parseInt() 原为转换字符串为数字，转换数字则向下取整
                end=pageNo+parseInt(continues/2);

                // 还需要把出现不正常的现象给纠正（start出现0或负数，end出现比总页数还要大）
                if(start<1){               //（1）start出现0或负数
                    start=1;
                    // 此时结束数字就为连续页码数
                    end=continues;
                } 
                if(end>totalPage){          // end出现比总页数还要大
                    end=totalPage;
                    // start一定比end小（continues-1）
                    start=totalPage-continues+1;
                }
            }
            return {start,end};
        }
    },

}
</script>
  
<style lang="less" scoped>
.pagination {
    text-align: center;
    button {
        margin: 0 5px;
        background-color: #f4f4f5;
        color: #606266;
        outline: none;
        border-radius: 2px;
        padding: 0 4px;
        vertical-align: top;
        display: inline-block;
        font-size: 13px;
        min-width: 35.5px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        box-sizing: border-box;
        text-align: center;
        border: 0;

        &[disabled] {
            color: #c0c4cc;
            cursor: not-allowed;
        }

        &.active {
            cursor: not-allowed;
            background-color: #409eff;
            color: #fff;
        }
    }
}
</style>