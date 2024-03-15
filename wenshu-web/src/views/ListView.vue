<template>
    <van-nav-bar title="搜索结果" left-arrow left-text="返回" @click-left="goBack" ></van-nav-bar>
    <span>ListView</span>
</template>

<script setup>
const goBack = () => history.back()
</script>