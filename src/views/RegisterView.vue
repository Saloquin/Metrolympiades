<script setup>
import { fetchApi } from '@/ApiUtil'
import AlertError from '@/components/AlertError.vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { faBoltLightning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const username = ref('')
const password = ref('')
const teamName = ref('')
const showError = ref(false)
const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()

const register = async () => {
  try {
    const teams = await fetchApi('/teams', { method: 'GET' })

    const isTeamNameTaken = teams.some(
      (team) => team.name.toLowerCase() === teamName.value.trim().toLowerCase()
    )

    if (isTeamNameTaken) {
      showError.value = true
      setTimeout(() => {
        showError.value = false
      }, 5000)
      return
    }

    const response = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        username: username.value,
        password: password.value,
        teamName: teamName.value
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

const closeError = () => {
  showError.value = false
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
    <AlertError message="teamNameTaken" :is-visible="showError" @close="closeError" />
    <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">
      <TranslationText text="register" />
    </h2>
    <form @submit.prevent="register">
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
        <label for="username" class="block text-sm font-medium text-gray-700">
          <TranslationText text="username" />
        </label>
        <input
          type="text"
          v-model="username"
          id="username"
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
      <div class="mb-4">
        <label for="teamName" class="block text-sm font-medium text-gray-700">
          <TranslationText text="teamName" />
        </label>
        <input
          type="text"
          v-model="teamName"
          id="teamName"
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
      >
        <FontAwesomeIcon :icon="faBoltLightning" />
        <span><TranslationText text="register" /></span>
      </button>
    </form>
    <p class="mt-4 text-center text-gray-600">
      <TranslationText text="alreadyHaveAccount" />
      <RouterLink to="/login" class="theme-primary hover:opacity-80">
        <TranslationText text="login" />
      </RouterLink>
    </p>
  </div>
</template>
