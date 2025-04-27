import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const errorMessage = ref('')
  const showError = ref(false)

  const showErrorMessage = (message) => {
    errorMessage.value = message
    showError.value = true
    setTimeout(() => {
      hideError()
    }, 5000)
  }

  const hideError = () => {
    showError.value = false
    errorMessage.value = ''
  }

  return {
    errorMessage,
    showError,
    showErrorMessage,
    hideError
  }
})