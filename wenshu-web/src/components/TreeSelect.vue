<template>
    <ul class="treeMenu">
        <li v-for="(item, index) in data" :key="item[propsCustom.key]">
            <i v-show="item[propsCustom.children] && item[propsCustom.children].length"
                :class="['triangle', carets[tapScopes[item[propsCustom.key]]]]" @click="changeStatus(item)" />
            <p :class="['treeNode', { 'treeNode--select': item.onSelect }]">
                <!-- <label class="checkbox-wrap" @click="checked(item)">
                    <input v-if="isSelect" v-model="item.checked" type="checkbox" class="checkbox" />
                </label> -->
                <span v-if="item[propsCustom.children] && item[propsCustom.children].length" class="title"
                    @click.prevent>{{ item[propsCustom.label] }}</span>
                <span v-else class="title clickable" @click.stop="tap(item, index)">{{ item[propsCustom.label] }}</span>
            </p>
            <TreeSelect
                v-if="scopes[item[propsCustom.key]] && item[propsCustom.children] && item[propsCustom.children].length"
                v-on:node-click="tap" :props-custom="propsCustom" :data="item[propsCustom.children]" />
        </li>
    </ul>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['change', 'node-click', 'checked']);
const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    isSelect: {
        type: Boolean,
        default: false,
    },
    propsCustom: {
        type: Object,
        default: () => {
            return {
                children: 'children',
                label: 'title',
                key: 'id',
            }
        },
    },
})

const CARETS = { open: 'caret-down', close: 'caret-right' };

const carets = CARETS;
const tapScopes = ref({});
const scopes = ref({});

const changeStatus = (item) => {
    const keyValue = item[props.propsCustom.key]
    emit('change', item);
    if (tapScopes.value[keyValue]) {
        tapScopes.value[keyValue] = tapScopes.value[keyValue] === 'open' ? 'close' : 'open'
    } else {
        tapScopes.value[keyValue] = 'open';
    }
    scopes.value[keyValue] = !scopes.value[keyValue];
};

const tap = (item, index) => {
    emit('node-click', item);
};

/* const checked = async (item) => {
    emit('checked', item);
}; */
</script>

<style scoped>
.treeMenu {
    padding-left: 1.2rem;
    list-style: none;
    position: relative;
    user-select: none;
}

.triangle {
    transition: all 0.1s;
    left: 6px;
    margin: 6px 0 0 0;
    position: absolute;
    cursor: pointer;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-left: 8px solid grey;
}

.caret-down {
    transform: rotate(90deg);
    left: 2px;
    margin: 9px 0 0 0;
}

.checkbox-wrap {
    display: flex;
    align-items: center;
}

.checkbox {
    margin-right: 0.5rem;
}

.treeNode {
    margin: 0.3rem 0;
    width: 100%;
}

.treeNode--select {
    font-weight: bolder;
}

.treeNode:hover>.operation {
    opacity: 1;
}

p {
    position: relative;
    display: flex;
    align-items: center;
}

p>.title {
    cursor: pointer;
}

p>.title:hover.clickable {
    color: #3771e5;

}

a {
    color: cornflowerblue;
}

.operation {
    position: absolute;
    right: 0;
    font-size: 18px;
    opacity: 0;
}
</style>
