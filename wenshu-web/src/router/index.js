import { createRouter, createWebHistory } from 'vue-router'

const IndexView = () => import('../views/IndexView.vue')
const SearchView = () => import('../views/SearchView.vue')
const NotFound = () => import('../views/NotFoundView.vue')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: IndexView },
        { path: '/index', component: IndexView },
        { path: '/search', component: SearchView },
        { path: '/:pathMatch(.*)', component: NotFound }
    ]
})

export default router
