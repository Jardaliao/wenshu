<template>
    <van-sticky>
        <van-nav-bar title="搜索" left-arrow left-text="返回" @click-left="goBack"></van-nav-bar>
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
                    @click="setActive('anjianleixingIndex', index); query.shenpanchengxuId = '';">
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
    <van-cell-group title=" ">
        <!-- 9 文书类型 -->
        <van-cell>
            <div class="op-title">
                <div>文书类型</div>
                <div class="op-actions">
                    <span>{{ query.wenshuleixingIndex >= 0 ? wslx[query.wenshuleixingIndex].name : "" }}</span>
                </div>
            </div>
            <div class="op-body">
                <div v-for="item, index in wslx"
                    :class="['op-body-item', index === query.wenshuleixingIndex ? 'active' : '']"
                    @click="setActive('wenshuleixingIndex', index)">
                    {{ item.name }}
                </div>
            </div>
        </van-cell>
    </van-cell-group>
    <van-cell-group title=" ">
        <van-field v-model="query.cprqStart" name="裁判开始日期" label="裁判开始日期" placeholder="选择日期"
            @click="cprqStartShow = true"></van-field>
        <van-field v-model="query.cprqEnd" name="裁判结束日期" label="裁判结束日期" placeholder="选择日期"
            @click="cprqEndShow = true"></van-field>
        <van-popup :show="cprqStartShow" round position="bottom">
            <van-date-picker title="裁判开始日期" :min-date="minDate" :max-date="maxDate" @confirm="cprqStartConfirm"
                @cancel="cprqStartShow = false" />
        </van-popup>
        <van-popup :show="cprqEndShow" round position="bottom">
            <van-date-picker title="裁判结束日期" :min-date="minDate" :max-date="maxDate" @confirm="cprqEndConfirm"
                @cancel="cprqEndShow = false" />
        </van-popup>
    </van-cell-group>
    <van-cell-group title=" ">
        <!-- 11 案例等级 -->
        <van-cell>
            <div class="op-title">
                <div>案例等级</div>
                <div class="op-actions">
                    <span>{{ query.anlidengjiIndex >= 0 ? aldj[query.anlidengjiIndex].name : "" }}</span>
                </div>
            </div>
            <div class="op-body">
                <div v-for="item, index in aldj"
                    :class="['op-body-item', index === query.anlidengjiIndex ? 'active' : '']"
                    @click="setActive('anlidengjiIndex', index)">
                    {{ item.name }}
                </div>
            </div>
        </van-cell>
        <!-- 12 公开类型 -->
        <van-cell>
            <div class="op-title">
                <div>公开类型</div>
                <div class="op-actions">
                    <span>{{ query.gongkaileixingIndex >= 0 ? gklx[query.gongkaileixingIndex].name : "" }}</span>
                </div>
            </div>
            <div class="op-body">
                <div v-for="item, index in gklx"
                    :class="['op-body-item', index === query.gongkaileixingIndex ? 'active' : '']"
                    @click="setActive('gongkaileixingIndex', index)">
                    {{ item.name }}
                </div>
            </div>
        </van-cell>
    </van-cell-group>
    <van-cell-group title=" ">
        <!-- 13 审判人员 -->
        <van-field v-model="query.shenpanrenyuan" name="审判人员" label="审判人员" placeholder="审判人员"></van-field>
        <!-- 14 当事人 -->
        <van-field v-model="query.dangshiren" name="当事人" label="当事人" placeholder="当事人"></van-field>
        <!-- 15 律所 -->
        <van-field v-model="query.lvsuo" name="律所" label="律所" placeholder="律所"></van-field>
        <!-- 16 律师 -->
        <van-field v-model="query.lvshi" name="律师" label="律师" placeholder="律师"></van-field>
    </van-cell-group>
    <van-cell-group>
        <!-- 17 法律依据 -->
        <van-field v-model="query.falvyiju" type="textarea" rows="3" autosize name="法律依据" label="法律依据"
            placeholder="例如：请输入《中华人民共和国民事诉讼法》第一百七十条"></van-field>
    </van-cell-group>
    <van-sticky position="bottom">
        <van-row class="footer">
            <van-col span="10" offset="1">
                <van-button plain icon="replay" round block @click="reset">重置</van-button>
            </van-col>
            <van-col span="10" offset="2">
                <van-button type="primary" icon="search" round block @click="search">搜索</van-button>
            </van-col>
        </van-row>
    </van-sticky>

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { dic } from '../utils/wenshu_dict'
import TreeSelect from '@/components/TreeSelect.vue'
import { uuid, random } from '@/utils/wenshu_raw';
import { currentUser } from '@/utils/bussiness';

const goBack = () => history.back()
const dataSample = {
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
    cprqStart: "",
    cprqEnd: "",
    anlidengjiIndex: -1,
    gongkaileixingIndex: -1,
    shenpanrenyuan: "",
    dangshiren: "",
    lvsuo: "",
    lvshi: "",
    falvyiju: "",
}

const query = ref(JSON.parse(JSON.stringify(dataSample)))
const setActive = (field, index) => { query.value[field] = index }

const qw = dic.qw // 1 全文检索
const ayTree = dic.ayTree // 2 案由
const ayValueMap = dic.ayValueMap
const selectAnyou = ({ id, name, children }) => { query.value.anyouId = id }
const fycj = dic.fycj // 6 法院层级
const ajlx = dic.ajlx // 7 案件类型
const spcx = dic.spcx // 8 审判程序
const spcxTrees = dic.spcxTrees
const selectShenpanchengxu = ({ id, name, children }) => { query.value.shenpanchengxuId = id }
const wslx = dic.wslx // 9 文书类型
const minDate = new Date(1970, 0, 1) // 10 裁判日期
const maxDate = new Date()
const cprqStartShow = ref(false)
const cprqEndShow = ref(false)
const cprqStartConfirm = ({ selectedValues }) => {
    query.value.cprqStart = selectedValues.join("-")
    cprqStartShow.value = false
}
const cprqEndConfirm = ({ selectedValues }) => {
    query.value.cprqEnd = selectedValues.join("-")
    cprqEndShow.value = false
}
const aldj = dic.aldj // 11 案例等级
const gklx = dic.gklx // 12 公开等级

const reset = () => { query.value = JSON.parse(JSON.stringify(dataSample)) }
const router = useRouter()
const pageId = uuid() // 生成pageId，需要传给后面的列表页面用
const requestToken = random() // 生成requestToken，需要传给后面的列表页面用

const search = async () => {
    const { code, success } = await currentUser({ pageId, requestToken })
    if (code !== 1 || !success) {
        router.push("/login")
        return
    }
    const q = { ...query.value, pageId, requestToken }
    router.push({ path: `/list`, query: {params: btoa(encodeURIComponent(JSON.stringify(q)))} })
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

.footer {
    padding: 0.5rem 0;
    border-top: 1px solid #eee;
    background-color: white;
}
</style>
