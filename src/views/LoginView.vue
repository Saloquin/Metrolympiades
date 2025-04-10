<script setup>
import { ref } from 'vue'
import { fetchApi } from '@/ApiUtil'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'  // Pour le thème
import { useRouter } from 'vue-router'  // Pour la redirection après connexion
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'  // Icône de connexion
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const email = ref('')
const password = ref('')
const userStore = useUserStore()
const themeStore = useThemeStore()  // Pour le thème
const router = useRouter()

// Fonction de login
const login = async () => {
  try {
    // Appel API pour vérifier les informations de l'utilisateur
    const response = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      })
    })
    
    // Si la connexion est réussie, on stocke l'utilisateur et le token
    userStore.login({
      id: response.id,
      email: response.email,
      name: response.username,
      team: response.team,
      token: response.token,
    })
    themeStore.initializeTheme()
    // Redirection vers la page de dashboard après connexion
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed', error)
    alert('Email ou mot de passe incorrect')
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
    <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" v-model="email" id="email" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" v-model="password" id="password" class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <button type="submit" class="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2">
        <FontAwesomeIcon :icon="faSignInAlt"/>
        <span>Login</span>
      </button>
    </form>
  </div>
</template>
