<template>
    <van-sticky>
        <van-nav-bar title="搜索" left-arrow="true" left-text="返回" @click-left="goBack"></van-nav-bar>
        <van-search placeholder="输入案由、关键词、法院、当事人、律师" v-model="query.quanwenjiansuo"></van-search>
    </van-sticky>
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
                    <span>{{ query.anyouId ? ayValueMap[query.anyouId].text : "" }}</span>
                </div>
            </div>
            <div class="op-body">
                <TreeSelect :data="ayTree" :props-custom="{ key: 'id', label: 'name', children: 'children' }"
                    v-on:node-click="selectAnyou" />
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
        <van-cell>
            <div class="op-title">
                <div>法院层级</div>
                <div class="op-actions">
                    <span>{{ query.fayuancengjiIndex >= 0 ? fycj[query.fayuancengjiIndex].name : "" }}</span>
                </div>
            </div>
            <div class="op-body">
                <div v-for="item, index in fycj"
                    :class="['op-body-item', index === query.fayuancengjiIndex ? 'active' : '']"
                    @click="setActive('fayuancengjiIndex', index)">
                    {{ item.name }}
                </div>
            </div>
        </van-cell>
    </van-cell-group>
    <van-cell-group title=" ">
        <!-- 7 案件类型 -->
        <van-cell>
            <div class="op-title">
                <div>案件类型</div>
                <div class="op-actions">
                    <span>{{ query.anjianleixingIndex >= 0 ? ajlx[query.anjianleixingIndex].name : "" }}</span>
                </div>
            </div>
            <div class="op-body">
                <div v-for="item, index in ajlx"
                    :class="['op-body-item', index === query.anjianleixingIndex ? 'active' : '']"
                    @click="setActive('anjianleixingIndex', index)">
                    {{ item.name }}
                </div>
            </div>
        </van-cell>
        <!-- 8 审判程序 -->
        <van-cell>
            <div class="op-title">
                <div>审判程序</div>
                <div class="op-actions">
                    <span>{{ query.shenpanchengxuId ? spcx[query.shenpanchengxuId] : "" }}</span>
                </div>
            </div>
            <div class="op-body">
                <TreeSelect :data="query.anjianleixingIndex >= 0 ? spcxTrees[ajlx[query.anjianleixingIndex].code] : []"
                    :props-custom="{ key: 'id', label: 'name', children: 'children' }"
                    v-on:node-click="selectShenpanchengxu" />
            </div>
        </van-cell>
    </van-cell-group>
</template>

<script setup>
import { ref } from 'vue'
import { dic } from '../utils/wenshu_dict'
import TreeSelect from '@/components/TreeSelect.vue'

const goBack = () => history.back()

const query = ref({
    quanwenjiansuo: "",
    quanwenjiansuoIndex: 0,
    anyouId: "",
    anjianmingchen: "",
    anhao: "",
    fayuanmingchen: "",
    fayuancengjiIndex: -1,
    anjianleixingIndex: -1,
    shenpanchengxuId: "",
    wenshuleixingIndex: -1,
    cprqStart: '',
    cprqEnd: '',
    anlidengjiIndex: -1,
    gongkaileixingIndex: -1,
    shenpanrenyuan: "",
    dangshiren: "",
    lvsuo: "",
    lvshi: "",
    falvyiju: "",
})

const setActive = (field, index) => { query.value[field] = index }

const qw = dic.qw // 1 全文检索
const ayTree = dic.ayTree // 2 案由
const ayValueMap = dic.ayValueMap
const selectAnyou = ({ id, name, children }) => { query.value.anyouId = id }
const fycj = dic.fycj // 6 法院层级
const ajlx = dic.ajlx // 7 案件类型
const spcx = dic.spcx // 8 审判程序
const spcxTrees = dic.spcxTrees
console.log(spcxTrees)
const selectShenpanchengxu = ({ id, name, children }) => { query.value.shenpanchengxuId = id }



</script>

<style scoped lang="less">
* {
    --main-bg-color: #1989FA;
}

.op-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    color: black;
}

.op-title>.op-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.8rem;

    color: #A6A6A6;
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
