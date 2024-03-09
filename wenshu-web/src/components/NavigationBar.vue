<script setup>

defineProps({
    title: {
        type: String,
        required: true
    },
    back: {
        type: String,
        required: true
    }
})

</script>

<template>
    <div class="navigation-bar">
        <div class="return">
            <img v-if="back == 'on'" src="../assets/arrow.svg" alt="">
            <span v-else></span>
        </div>
        <div class="title">{{ title }}</div>
        <div></div>
    </div>
</template>

<style scoped lang="less">
.navigation-bar {
    height: 3.5rem;

    display: flex;
    flex-direction: row;
    align-items: center;

    >div {
        flex: 1;
    }

    >.return {


        display: flex;
        align-items: center;

        >img {
            margin-left: 1rem;
            height: 1.2rem;
            width: 1.2rem;
        }

    }

    .title {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
