<template>
    <van-nav-bar title="搜索结果" left-arrow left-text="返回" @click-left="goBack"></van-nav-bar>
    <van-dropdown-menu>
        <van-dropdown-item v-model="sortField" :options="sortOps" />
    </van-dropdown-menu>

    <span>ListView</span>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const goBack = () => history.back()

const sortField = ref("s50:desc");
const sortOps = [
    { text: '默认排序', value: "s50:desc", },
    { text: '法院层级 ⬇', value: "s50:desc" },
    { text: '法院层级 ⬆', value: "s50:asc" },
    { text: '裁判日期 ⬇', value: "s51:desc" },
    { text: '裁判日期 ⬆', value: "s51:asc" },
    { text: '审判程序 ⬇', value: "s52:desc" },
    { text: '审判程序 ⬆', value: "s52:asc" },
];
const query = route.query



</script>