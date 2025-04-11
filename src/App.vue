<script setup>
import Navbar from './components/NavBar.vue'
import ThemeSettings from './components/ThemeSettings.vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { onMounted, watch } from 'vue'

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

watch(() => userStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    themeStore.initializeTheme()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <Navbar />
    <main class="p-4">
      <RouterView />
    </main>
    <ThemeSettings :showColorSettings="userStore.isLoggedIn" />
  </div>
</template>