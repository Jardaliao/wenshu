<template>
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
    </router-view>
</template>

<style>
* {
    box-sizing: border-box;
}

body {
    --root-background-color: #f7f8fa;
    background-color: var(--root-background-color);
}
</style>
