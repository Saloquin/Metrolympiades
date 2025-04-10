<script setup>
import { ref } from 'vue'
import { fetchApi } from '@/ApiUtil'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme' 
import { useRouter } from 'vue-router'  // Pour la redirection après inscription
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBoltLightning } from '@fortawesome/free-solid-svg-icons' // Icône pour les victoires

const email = ref('')
const username = ref('')
const password = ref('')
const teamName = ref('')
const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()

// Fonction d'inscription
const register = async () => {
  try {
    // Appel API pour créer l'utilisateur
    const response = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        username: username.value,
        password: password.value,
        teamName: teamName.value,
      })
    })
    
    // Si l'inscription est réussie, on stocke l'utilisateur et le token
    userStore.login({
      id: response.id,
      email: response.email,
      name: response.username,
      team: response.team,
      token: response.token,
    })
    themeStore.initializeTheme()
    // Redirection vers la page de dashboard après inscription
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration failed', error)
    alert('Erreur lors de l\'inscription. Veuillez vérifier vos informations.')
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
    <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">Register</h2>
    <form @submit.prevent="register">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" v-model="email" id="email" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <input type="text" v-model="username" id="username" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" v-model="password" id="password" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <label for="teamName" class="block text-sm font-medium text-gray-700">Team Name</label>
        <input type="text" v-model="teamName" id="teamName" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button type="submit" class="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2">
        <FontAwesomeIcon :icon="faBoltLightning"/>
        <span>Register</span>
      </button>
    </form>
  </div>
</template>
