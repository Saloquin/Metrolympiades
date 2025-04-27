import { defineStore } from 'pinia'

const DEFAULT_THEME = {
  primaryColor: '#3B82F6',
  secondaryColor: '#EAB308',
  fontSize: 'medium'
}
export const useThemeStore = defineStore('theme', {
  state: () => ({
    primaryColor: localStorage.getItem('primaryColor') || DEFAULT_THEME.primaryColor,
    secondaryColor: localStorage.getItem('secondaryColor') || DEFAULT_THEME.secondaryColor,
    fontSize: localStorage.getItem('fontSize') || DEFAULT_THEME.fontSize
  }),
  actions: {
    initializeTheme() {
      this.setPrimaryColor(localStorage.getItem('primaryColor') || DEFAULT_THEME.primaryColor)
      this.setSecondaryColor(localStorage.getItem('secondaryColor') || DEFAULT_THEME.secondaryColor)
      this.setFontSize(localStorage.getItem('fontSize') || DEFAULT_THEME.fontSize)
    },
    initializeFontSizeOnly() {
      this.setFontSize(localStorage.getItem('fontSize') || DEFAULT_THEME.fontSize)
      this.setTempPrimaryColor(DEFAULT_THEME.primaryColor)
      this.setTempSecondaryColor(DEFAULT_THEME.secondaryColor)
    },
    resetAll() {
      this.setPrimaryColor(DEFAULT_THEME.primaryColor)
      this.setSecondaryColor(DEFAULT_THEME.secondaryColor)
      this.setFontSize(DEFAULT_THEME.fontSize)
      localStorage.removeItem('primaryColor')
      localStorage.removeItem('secondaryColor')
      localStorage.removeItem('fontSize')
    },
    resetFontSizeOnly() {
      this.setFontSize(DEFAULT_THEME.fontSize)
      localStorage.removeItem('fontSize')
    },
    setPrimaryColor(color) {
      this.primaryColor = color
      localStorage.setItem('primaryColor', color)
      document.documentElement.style.setProperty('--primary-color', color)
    },
    setTempPrimaryColor(color) {
      this.primaryColor = color
      document.documentElement.style.setProperty('--primary-color', color)
    },
    setSecondaryColor(color) {
      this.secondaryColor = color
      localStorage.setItem('secondaryColor', color)
      document.documentElement.style.setProperty('--secondary-color', color)
    },
    setTempSecondaryColor(color) {
      this.secondaryColor = color
      document.documentElement.style.setProperty('--secondary-color', color)
    },
    setFontSize(size) {
      this.fontSize = size
      localStorage.setItem('fontSize', size)
      document.documentElement.setAttribute('data-font-size', size)
    }
  }
})
