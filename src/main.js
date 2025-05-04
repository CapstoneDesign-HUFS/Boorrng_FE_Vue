import './assets/main.css'
import store from './store.js' // vuex store

import { createApp } from 'vue'
import App from './App.vue'


import router from './router'
createApp(App).use(router).use(store).mount('#app')
