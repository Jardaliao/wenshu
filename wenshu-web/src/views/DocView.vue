<template>
    <van-sticky>
        <van-nav-bar title="文书详情" left-arrow left-text="返回" @click-left="goBack"></van-nav-bar>
    </van-sticky>
</template>

<script setup>
const goBack = () => {
    history.back()
}
</script>