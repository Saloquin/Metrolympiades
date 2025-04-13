import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import TranslationText from './components/traductions/TranslationText.vue'

import 'vue-cal/dist/vuecal.css'
import App from './App.vue'
import router from './router'

if (import.meta.env.PROD) {
  console.debug = () => {}
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit = () => {}
}
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('TranslationText', TranslationText)
app.mount('#app')
