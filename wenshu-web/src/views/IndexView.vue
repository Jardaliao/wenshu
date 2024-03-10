<template>
    <main>
        <NavigationBar title="易文书" back="off"></NavigationBar>
        <router-link :to="{ path: 'search' }">
            <div class="weui-search-bar" id="searchBar">
                <form class="weui-search-bar__form">
                    <div class="weui-search-bar__box">
                        <i class="weui-icon-search"></i>
                        <input type="search" class="weui-search-bar__input" placeholder="搜索" required="">
                        <a href="javascript:" class="weui-icon-clear"></a>
                    </div>
                    <label class="weui-search-bar__label">
                        <i class="weui-icon-search"></i>
                        <span>搜索</span>
                    </label>
                </form>
                <a href="javascript:" class="weui-search-bar__cancel-btn">取消</a>
            </div>
        </router-link>
    </main>
</template>

<script setup>
import NavigationBar from '../components/NavigationBar.vue'

</script>

<style scoped lang="less">
main {
    margin: 0;
}
</style>
