import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'vue-cal/dist/vuecal.css'

if (import.meta.env.PROD) {
  console.debug = () => {}
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit = () => {}
}
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
