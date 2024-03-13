import { createApp } from 'vue'
import { Search, NavBar, CellGroup, Cell, Field, TreeSelect, Dialog, Sticky } from 'vant'

import App from './App.vue'
import router from './router'

import 'vant/lib/index.css'

const app = createApp(App)

app.use(router)

const requiredVant = [Sticky, Search, NavBar, Field, CellGroup, Cell, TreeSelect, Dialog];
for (let v of requiredVant) { app.use(v) }

app.mount('#app')
