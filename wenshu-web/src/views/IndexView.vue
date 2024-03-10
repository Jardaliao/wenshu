<template>
    <main>
        <NavigationBar title="易文书" back="off"></NavigationBar>
        <router-link :to="{ path: 'search' }">
            <SearchBar holder="输入案由、关键词、法院、当事人、律师"></SearchBar>
        </router-link>
    </main>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue'
import SearchBar from '@/components/SearchBar.vue';

</script>

<style scoped lang="less">
main {
    margin: 0;
}
</style>
