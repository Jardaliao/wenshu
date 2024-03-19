<template>
    <van-nav-bar title="搜索结果" left-arrow left-text="返回" @click-left="goBack"></van-nav-bar>
    <van-dropdown-menu>
        <van-dropdown-item v-model="sortField" :options="sortOps" />
    </van-dropdown-menu>

    <span>ListVie</span>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { dic } from '../utils/wenshu_dict';
import { queryDoc } from '@/utils/bussiness';

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
const query = JSON.parse(decodeURIComponent(atob(route.query.params))) // 此时的 query 不再是 ref 对象了，是普通的 js 对象
const { pageId, requestToken } = query
const pageNum = ref(1)
const list = ref([])
onMounted(() => { nextPage() })
const nextPage = async () => {
    const rr = await queryDoc({
        pageId,
        pageNum: pageNum.value,
        requestToken,
        sortFields: sortField.value,
        queryCondition: JSON.stringify(query2Request(query)),
    }, {})
    console.log(rr)
    if (rr.code === 1 && rr.success) {
        list.value.push(result2List(rr.data.result))
        // console.log(list)
        pageNum.value = pageNum.value + 1 // 翻一页
    }
}

/**
   * 将查询表单对象转化为实际的查询条件
   * 总共 17 个，一个个来
   * @param {Object} query 查询表单对象
   */
const query2Request = (query) => {
    const queryCondition = [];
    // 1 全文检索
    if (query.quanwenjiansuo) {
        queryCondition.push({
            key: dic.qw[query.quanwenjiansuoIndex].key,
            value: query.quanwenjiansuo
        })
    }
    // 2 案由
    if (query.anyouId) {
        queryCondition.push({
            key: "s13",
            value: query.anyouId
        })
    }
    // 3 案件名称
    if (query.anjianmingcheng) {
        queryCondition.push({
            key: "s1",
            value: query.anjianmingcheng
        })
    }
    // 4 案号
    if (query.anhao) {
        queryCondition.push({
            key: "s7",
            value: query.anhao
        })
    }
    // 5 法院名称
    if (query.fayuanmingcheng) {
        queryCondition.push({
            key: "s2",
            value: query.fayuanmingcheng
        })
    }
    // 6 法院层级
    if (query.fayuancengjiIndex >= 0) {
        queryCondition.push({
            key: "s4",
            value: dic.fycj[query.fayuancengjiIndex].code
        })
    }
    // 7 案件类型
    if (query.anjianleixingIndex >= 0) {
        queryCondition.push({
            key: "s8",
            value: dic.ajlx[query.anjianleixingIndex].code
        })
    }
    // 8 审判程序
    if (query.shenpanchengxuId) {
        queryCondition.push({
            key: "s10",
            value: query.shenpanchengxuId
        })
    }
    // 9 文书类型
    if (query.wenshuleixingIndex >= 0) {
        queryCondition.push({
            key: "s6",
            value: dic.wslx[query.wenshuleixingIndex].code
        })
    }
    // 10 裁判日期开始 & 结束时间
    const cprqStart = query.cprqStart ? query.cprqStart : '1900-01-01',
        cprqEnd = query.cprqEnd ? query.cprqEnd : '2099-01-01';
    queryCondition.push({
        key: "cprq",
        value: `${cprqStart} TO ${cprqEnd}`
    })
    // 11 案例等级
    if (query.anlidengjiIndex >= 0) {
        queryCondition.push({
            key: "s44",
            value: dic.aldj[query.anlidengjiIndex].code
        })
    }
    // 12 公开类型
    if (query.gongkaileixingIndex >= 0) {
        queryCondition.push({
            key: "s43",
            value: dic.gklx[query.gongkaileixingIndex].code
        })
    }
    // 13 审判人员
    if (query.shenpanrenyuan) {
        queryCondition.push({
            key: "s18",
            value: query.shenpanrenyuan
        })
    }
    // 14 当事人
    if (query.dangshiren) {
        queryCondition.push({
            key: "s17",
            value: query.dangshiren
        })
    }
    // 15 律所
    if (query.lvsuo) {
        queryCondition.push({
            key: "s20",
            value: query.lvsuo
        })
    }
    // 16 律师
    if (query.lvshi) {
        queryCondition.push({
            key: "s19",
            value: query.lvshi
        })
    }
    // 17 法律依据
    if (query.falvyiju) {
        queryCondition.push({
            key: "s29",
            value: query.falvyiju
        })
    }

    console.log(queryCondition)
    return queryCondition
}
const result2List = (result) => {
    const list = result.queryResult.resultList
    for (let item of list) {
        item["relWenshu"] = result.relWenshu[item["rowkey"]]
    }
    return list
}


</script>