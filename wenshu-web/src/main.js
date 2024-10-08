import { createApp } from 'vue'
import store from './store'
import {
    Form, Row, Col, Button, Search, NavBar,
    CellGroup, Cell, Field, TreeSelect, Dialog,
    Sticky, PickerGroup, Picker, DatePicker, Popup,
    RadioGroup, Radio, CheckboxGroup, Checkbox,
    Icon, ConfigProvider, Overlay, Loading, DropdownMenu,
    DropdownItem, List, TextEllipsis, Tag, Toast, FloatingPanel,
    Swipe, SwipeItem, Grid, GridItem, Tabs, Tab,
    Empty
} from 'vant'

import App from './App.vue'
import router from './router'

import 'vant/lib/index.css'
import axios from 'axios'

const app = createApp(App)

axios.defaults.withCredentials = true

app.use(store)

app.use(router)

const requiredVant = [RadioGroup, Radio, Form, Row, Col, Button,
    Sticky, Search, NavBar, Field, CellGroup, Cell, TreeSelect,
    Dialog, PickerGroup, DatePicker, Popup, CheckboxGroup, Checkbox,
    Picker, Icon, ConfigProvider, Overlay, Loading, DropdownMenu,
    DropdownItem, List, TextEllipsis, Tag, Toast, FloatingPanel,
    Swipe, SwipeItem, Grid, GridItem, Tabs, Tab, Empty];
for (let v of requiredVant) { app.use(v) }

app.mount('#app')
