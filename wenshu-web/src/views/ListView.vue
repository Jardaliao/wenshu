<template>
    <van-sticky>
        <van-nav-bar title="搜索结果" left-arrow left-text="返回" @click-left="goBack"></van-nav-bar>
        <van-dropdown-menu>
            <van-dropdown-item v-model="sortField" :options="sortOps" @change="sortChange" />
        </van-dropdown-menu>
    </van-sticky>
    <van-cell-group insert>
        <van-list v-model:error="error" v-model:loading="loading" :finished="finished" finished-text="没有更多了"
            @load="loadMore">
            <van-cell v-for="(item, index) in list" class="van-haptics-feedback">
                <template #title>
                    <div @click="goDetail(item)">
                        <van-tag type="primary">{{ dic.spcx[item['10'] ? item['10'] : item['9']] }}</van-tag>
                        &nbsp<span>{{ item["1"] }}</span>
                    </div>
                </template>
                <template #label>
                    <div class="flex-row-between">
                        <span>{{ item['2'] }}</span>
                        <span style="padding-right: 1rem;">{{ item['31'] }}</span>
                    </div>
                    <van-text-ellipsis style="margin-top: 0.5rem;" rows="2" :content="item['26']" expand-text="展开"
                        collapse-text="收起"></van-text-ellipsis>
                </template>
            </van-cell>
        </van-list>
    </van-cell-group>

</template>

<script>
export default { name: 'list' }
</script>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { dic } from '../utils/wenshu_dict';
import { queryDoc } from '@/utils/bussiness';
import { useStore } from 'vuex';
import { showToast } from 'vant';

const store = useStore()
store.commit("activeKeepAlive", "list") // 开启 keep-alive
const route = useRoute()
const router = useRouter()
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
const sortChange = (value) => {
    sortField.value = value
    list.value = []
}
const query = JSON.parse(decodeURIComponent(atob(route.query.params))) // 此时的 query 不再是 ref 对象了，是普通的 js 对象
const { pageId, requestToken } = query
const pageNum = ref(1), pageSize = 10
const goDetail = ({ rowkey }) => {
    router.push({ path: `/doc`, query: { rowkey } })
}
const list = ref([])
const nextPage = async () => {
    const rr = await queryDoc({
        pageId,
        pageNum: pageNum.value,
        pageSize,
        requestToken,
        sortFields: sortField.value,
        queryCondition: JSON.stringify(query2Request(query)),
    }, {})
    console.log(rr)
    if (rr.code === 0 && rr.success) {
        const rResult = result2List(rr.data.result)
        list.value.push(...rResult)
        console.log(list.value)
        if (rResult.length < pageSize) {
            finished.value = true
        } else {
            pageNum.value = pageNum.value + 1 // 翻一页
        }
    } else { // 失败了就 finish，不再重试，防止风险
        finished.value = true
        showToast(`查询异常(${rr.code})`)
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

const loading = ref(false), error = ref(false), finished = ref(false)
const loadMore = async () => {
    console.log("loadmore")
    setTimeout(() => { loading.value = false }, 3000)
    await nextPage()
}


</script>
<style>
.flex-row-between {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>