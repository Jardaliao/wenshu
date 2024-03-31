<template>
    <van-sticky>
        <van-nav-bar title="易文书"></van-nav-bar>
    </van-sticky>
    <router-link :to="{ path: 'search' }">
        <van-search placeholder="输入案由、关键词、法院、当事人、律师"></van-search>
    </router-link>
    <!-- <van-swipe class="my-swipe" :autoplay="15000">
        <van-swipe-item>1</van-swipe-item>
        <van-swipe-item>2</van-swipe-item>
    </van-swipe> -->
    <van-grid :gutter="10" :column-num="3" style="padding-top: 10px">
        <van-grid-item class="van-haptics-feedback" text="刑事案件" @click="goSearch"
            data-pageId="783ecaf500139504381352a7e936eae7" data-ajlx="02">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="M9 4v40M16 9v28M24 9v28M32 9v28M42 44H6M42 37H6M39 4v40M42 9H6" data-follow-stroke="#333" />
                </svg>
            </template>
        </van-grid-item>
        <van-grid-item class="van-haptics-feedback" text="民事案件" @click="goSearch"
            data-pageId="867047037b0b184f902001fb9c233adf" data-ajlx="03">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="m16 22-6-10-6 10" data-follow-stroke="#333" />
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="M10 28a6 6 0 0 0 6-6H4a6 6 0 0 0 6 6Z" clip-rule="evenodd" data-follow-stroke="#333" />
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="m44 22-6-10-6 10" data-follow-stroke="#333" />
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="M38 28a6 6 0 0 0 6-6H32a6 6 0 0 0 6 6Z" clip-rule="evenodd" data-follow-stroke="#333" />
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="M24 6v36M10 12h28M10 12h28M38 42H10" data-follow-stroke="#333" />
                </svg>
            </template>
        </van-grid-item>
        <van-grid-item class="van-haptics-feedback" text="行政案件" @click="goSearch"
            data-pageId="8d7c91487cbf22d806dc2dc72a884f49" data-ajlx="04">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="M4 18h40L24 6 4 18ZM44 42H4M9 18v24M19 18v24M29 18v24M39 18v24" data-follow-stroke="#333" />
                </svg>
            </template>
        </van-grid-item>
        <van-grid-item class="van-haptics-feedback" text="赔偿案件" @click="goSearch"
            data-pageId="ff1b8f5a8b1b594e181a2a9639e9a71d" data-ajlx="05">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                    <path stroke-linejoin="round" stroke-width="4" stroke="#333"
                        d="M4 14a2 2 0 0 1 2-2h36a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V14Z"
                        data-follow-stroke="#333" />
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="m19 19 5 5 5-5M18 25h12M18 31h12M24 25v10M8 6h32" data-follow-stroke="#333" />
                </svg>
            </template>
        </van-grid-item>
        <van-grid-item class="van-haptics-feedback" text="执行案件" @click="goSearch"
            data-pageId="90ac806e69dd21bf1be890d957cd2e46" data-ajlx="10">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="M39 6H9a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3Z"
                        data-follow-stroke="#333" />
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="m21 31 5 4 8-10M14 15h20M14 23h8" data-follow-stroke="#333" />
                </svg>
            </template>
        </van-grid-item>
        <van-grid-item class="van-haptics-feedback" text="其他案件" @click="goSearch">
            <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="M38 4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
                        data-follow-stroke="#333" />
                    <path d="M28 16c0 1.38-.56 2.63-1.465 3.535A5 5 0 1 1 28 16Z" />
                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="#333"
                        d="m30 23-3.465-3.465m0 0a5 5 0 1 0-7.071-7.07 5 5 0 0 0 7.072 7.07ZM17 30h14M17 36h7"
                        data-follow-stroke="#333" />
                </svg>
            </template>
        </van-grid-item>
    </van-grid>
    <van-tabs class="my-tabs" v-model:active="active" shrink>
        <van-tab title="金牌律师">
            <template #title>
                🥇金牌律师
            </template>
            <van-empty description="空空如也～"></van-empty>
        </van-tab>
        <van-tab title="金牌律所">
            <template #title>
                🥇金牌律所
            </template>
            <van-empty description="空空如也～"></van-empty>
        </van-tab>
    </van-tabs>
</template>

<script setup>
import { dic } from '../utils/wenshu_dict';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter()
const store = useStore()

const active = ref(0)

const goSearch = (event) => {
    event.stopPropagation(); // 阻止事件继续传播
    // console.log(event.currentTarget.dataset)
    const { pageid: pageId, ajlx } = event.currentTarget.dataset;
    if (pageId && ajlx) {
        console.log(pageId, ajlx)
        for (let i = 0; i < dic.ajlx.length; i++) {
            if (dic.ajlx[i].code !== ajlx) continue
            store.commit("inactiveKeepAlive", "search")
            const params = { pageId, query: { anjianleixingIndex: i } }
            router.push({
                path: `/search`, query: {
                    params: encodeURIComponent(JSON.stringify(params))
                }
            })
            return
        }
    }
    store.commit("inactiveKeepAlive", "search")
    router.push({ path: "/search" })
}
</script>

<style scoped lang="less">
main {
    margin: 0;
}

.my-swipe {
    margin: 10px 10px 0 10px;
    border-radius: 5px;

    .van-swipe-item {
        font-size: 20px;
        line-height: 150px;
        text-align: center;
        background-color: white;
    }
}

svg {
    height: 2rem;
    width: 2rem;
}

.my-tabs {
    margin-top: 10px;
}
</style>
