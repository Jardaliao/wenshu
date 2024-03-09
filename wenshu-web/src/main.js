import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import weui from 'weui.js'
import 'weui'

const app = createApp(App)

app.config.globalProperties.$weui = weui

app.use(router)

app.mount('#app')
