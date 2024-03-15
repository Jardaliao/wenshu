import { createApp } from 'vue'
import { Row,Col,Button, Search, NavBar, CellGroup, Cell, Field, TreeSelect, Dialog, Sticky, PickerGroup, DatePicker,Popup } from 'vant'

import App from './App.vue'
import router from './router'

import 'vant/lib/index.css'

const app = createApp(App)

app.use(router)

const requiredVant = [Row,Col,Button,Sticky, Search, NavBar, Field, CellGroup, Cell, TreeSelect, Dialog, PickerGroup, DatePicker, Popup];
for (let v of requiredVant) { app.use(v) }

app.mount('#app')
