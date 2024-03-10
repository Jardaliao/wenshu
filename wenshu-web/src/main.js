import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import WeuiVue from 'weui-design-vue'

import 'weui-design-vue/lib/weui-design-vue.css'

const app = createApp(App)

app.use(WeuiVue)

app.use(router)

app.mount('#app')
