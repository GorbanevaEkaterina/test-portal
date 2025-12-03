import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './scss/styles.scss'
import App from './App.vue'
import router from './router/index'
import '@fortawesome/fontawesome-free/css/all.css'

// Создаём экземпляр приложения
const app = createApp(App)

// Создаём и подключаем Pinia
const pinia = createPinia()
app.use(pinia)

// Подключаем роутер
app.use(router)

// Монтируем приложение
app.mount('#app')
