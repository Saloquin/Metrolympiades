<script setup>
import { fetchApi } from '@/ApiUtil'
import TranslationText from '@/components/traductions/TranslationText.vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()

// Fonction de login
const login = async () => {
  try {
    const response = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    userStore.login({
      id: response.id,
      email: response.email,
      name: response.username,
      team: response.team,
      token: response.token
    })
    themeStore.initializeTheme()
    router.push('/dashboard')
  } catch (error) {
    // Afficher une alerte ou un message d'erreur
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
    <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">
      <TranslationText text="login" />
    </h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">
          <TranslationText text="email" />
        </label>
        <input
          type="email"
          v-model="email"
          id="email"
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">
          <TranslationText text="password" />
        </label>
        <input
          type="password"
          v-model="password"
          id="password"
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
      >
        <FontAwesomeIcon :icon="faSignInAlt" />
        <span><TranslationText text="login" /></span>
      </button>
    </form>
    <p class="mt-4 text-center text-gray-600">
      <TranslationText text="noAccount" />
      <RouterLink to="/register" class="theme-primary hover:opacity-80">
        <TranslationText text="createAccount" />
      </RouterLink>
    </p>
  </div>
</template>
