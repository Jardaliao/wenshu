import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: '/',
        name: "IndexView",
        component: () => import('../views/IndexView.vue')
    }, {
        path: "/search",
        name: "SearchView",
        component: () => import('../views/SearchView.vue')
    }]
})

export default router
