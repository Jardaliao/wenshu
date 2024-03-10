import { createApp } from 'vue'
import { Search, NavBar, CellGroup, Cell } from 'vant'

import App from './App.vue'
import router from './router'

import 'vant/lib/index.css'

const app = createApp(App)

app.use(router)

const requiredVant = [Search, NavBar, CellGroup, Cell];
for (let v of requiredVant) { app.use(v) }

app.mount('#app')
