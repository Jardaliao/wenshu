import { createRouter, createWebHistory } from 'vue-router'

const IndexView = () => import('../views/IndexView.vue')
const SearchView = () => import('../views/SearchView.vue')
const ListView = () => import('../views/ListView.vue')
const DocView = () => import('../views/DocView.vue')
const LoginView = () => import('../views/LoginView.vue')
const NotFound = () => import('../views/NotFoundView.vue')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: IndexView },
        { path: '/index', component: IndexView },
        { path: '/search', component: SearchView },
        { path: '/list', component: ListView },
        { path: '/doc', component: DocView },
        { path: '/login', component: LoginView },
        { path: '/:pathMatch(.*)', component: NotFound }
    ]
})

export default router
