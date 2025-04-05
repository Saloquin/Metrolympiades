<script setup>
import Navbar from './components/Navbar.vue'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
userStore.initializeUser()

</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <Navbar />
    <main class="p-4">
      <RouterView />
    </main>
  </div>
</template>



