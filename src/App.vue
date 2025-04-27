<script setup>
import Navbar from './components/NavBar.vue'
import ThemeSettings from './components/ThemeSettings.vue'
import AlertError from '@/components/AlertError.vue'
import { useErrorStore } from '@/stores/error'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { onMounted, watch } from 'vue'

const errorStore = useErrorStore()
const userStore = useUserStore()
const themeStore = useThemeStore()

onMounted(() => {
  userStore.initializeUser()
  if (userStore.isLoggedIn) {
    themeStore.initializeTheme()
  } else {
    themeStore.initializeFontSizeOnly()
  }
})

watch(
  () => userStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) {
      themeStore.initializeTheme()
    }
  }
)
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <AlertError
      :message="errorStore.errorMessage"
      :is-visible="errorStore.showError"
      @close="errorStore.hideError"
    />
    <Navbar />
    <main class="p-4">
      <RouterView />
    </main>
    <ThemeSettings :showColorSettings="userStore.isLoggedIn" />
  </div>
</template>
