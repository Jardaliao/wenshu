<template>
    <router-view v-slot="{ Component }">
        <keep-alive :include="store.state.keepAliveInclude">
            <component :is="Component" :key="$route.name" />
        </keep-alive>
    </router-view>
</template>

<script setup>
import { useStore } from 'vuex'
const store = useStore()
console.log(store.state.keepAliveInclude)
</script>

<style>
* {
    box-sizing: border-box;
}

body {
    --root-background-color: #f7f8fa;
    background-color: var(--root-background-color);
}
</style>
