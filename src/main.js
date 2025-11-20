import './assets/main.css'

import { createApp } from 'vue'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)
app.use(ToastService)
app.component('Button', Button)
app.component('Toast', Toast)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.mount('#app')
