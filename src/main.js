import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import loginService from '@/services/login'

const app = createApp(App)

loginService.updateAdminState()

app.use(router)
app.mount('#app')
