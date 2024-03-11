<template>
    <van-nav-bar title="易文书"></van-nav-bar>
    <router-link :to="{ path: 'search' }">
        <van-search placeholder="输入案由、关键词、法院、当事人、律师"></van-search>
    </router-link>
</template>

<script setup>

</script>

<style scoped lang="less">
main {
    margin: 0;
}
</style>
