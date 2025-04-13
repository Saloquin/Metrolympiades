import translations from '@/locales'
import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: localStorage.getItem('language') || 'fr'
  }),
  actions: {
    setLanguage(lang) {
      this.currentLanguage = lang
      localStorage.setItem('language', lang)
    },
    translate(key) {
      return translations[this.currentLanguage]?.[key] || key
    }
  }
})
