<template>
    <van-nav-bar title="搜索" left-arrow="true" left-text="返回" @click-left="goBack"></van-nav-bar>
    <van-search placeholder="输入案由、关键词、法院、当事人、律师" v-model="query.quanwenjiansuo"></van-search>
    <van-cell-group>
        <!-- 1 全文检索 -->
        <van-cell>
            <div class="op-title">
                <div>全文检索</div>
                <div class="op-actions">
                    <span>{{ qw[query.quanwenjiansuoIndex].name }}</span>
                </div>
            </div>
            <div class="op-body">
                <div v-for="item, index in qw"
                    :class="['op-body-item', index === query.quanwenjiansuoIndex ? 'active' : '']"
                    @click="setActive('quanwenjiansuoIndex', index)">
                    {{ item.name }}
                </div>
            </div>
        </van-cell>
    </van-cell-group>
    <van-cell-group>
        <!-- 2 案由 -->
        <van-cell>
            <div class="op-title">
                <div>案由</div>
                <div class="op-actions">
                    <span>{{ qw[query.quanwenjiansuoIndex].name }}</span>
                </div>
            </div>
            <div class="op-body">
                <TreeSelect :isSelect="isSelect" :data="treeData" @node-click="handle" @change="loadData" />
            </div>
        </van-cell>
    </van-cell-group>
    <van-cell-group title=" ">
        <!-- 3 案件名称 -->
        <van-field v-model="query.anjianmingchen" name="案件名称" label="案件名称" placeholder="案件名称"></van-field>
        <!-- 4 案号 -->
        <van-field v-model="query.anhao" name="案号" label="案号" placeholder="案号"></van-field>
    </van-cell-group>
    <van-cell-group title=" ">
        <!-- 5 法院名称 -->
        <van-field v-model="query.fayuanmingchen" name="法院名称" label="法院名称" placeholder="法院名称"></van-field>
        <!-- 6 法院层级 -->

    </van-cell-group>
</template>

<script setup>
import { ref } from 'vue'
import { dic } from "../utils/wenshu_dict"
import TreeSelect from '@/components/TreeSelect.vue'

const activeId = ref(1)
const activeIndex = ref(0)
const treeData = [
    {
        key: 2,
        title: '小卖部总舵',
        children: [
            {
                key: 90037,
                title: '小卖部河边分部',
            },
        ],
    },
];


const goBack = () => history.back()
const qw = ref(dic.qw)
const query = ref({
    quanwenjiansuo: "",
    quanwenjiansuoIndex: 0
})
const setActive = (field, index) => {
    query.value[field] = index
}
</script>

<style scoped lang="less">
* {
    --main-bg-color: #1989FA;
}

.op-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.op-title>.op-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.8rem;
}

.op-body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.op-body>.op-body-item {
    box-sizing: border-box;
    margin: 4px;
    padding: 2px 4px;
    font-size: 0.9rem;
    color: #A6A6A6;
    border: 1px solid #A6A6A6;
    border-radius: 4px;
}

.op-body>.op-body-item.active {
    background-color: var(--main-bg-color);
    color: white;
    border: 1px solid var(--main-bg-color);
}
</style>
