<template>
    <main>
        <NavigationBar title="高级搜索" back="on"></NavigationBar>
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
