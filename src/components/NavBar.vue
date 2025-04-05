<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const showDropdown = ref(false) // Contrôle l'affichage du dropdown
const showMobileMenu = ref(false) // Contrôle l'affichage du menu mobile
// Fonction de déconnexion
const logout = () => {
  showMobileMenu.value = false
  userStore.logout() // Appelle la méthode logout du store
  router.push('/')
}
</script>

<template>
  <nav class="bg-white shadow-md py-3 px-6 flex justify-between items-center relative">
    <RouterLink to="/" class="text-xl font-bold text-blue-600">Métrolympiades</RouterLink>

    <!-- Menu mobile toggle -->
    <button
      @click="showMobileMenu = !showMobileMenu"
      class="lg:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        ></path>
      </svg>
    </button>

    <div class="flex gap-4 items-center hidden lg:flex">
      <!-- Liens visibles pour tous -->
      <RouterLink class="text-gray-700 hover:text-blue-600" to="/ranking">Classement</RouterLink>

      <!-- Si l'utilisateur est connecté, afficher ces liens -->
      <template v-if="userStore.currentUser">
        <RouterLink class="text-gray-700 hover:text-blue-600" to="/dashboard">Dashboard</RouterLink>

        <!-- Dropdown pour Mon équipe -->
        <div class="relative">
          <button
            @mouseenter="showDropdown = true"
            class="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            Mon équipe
          </button>
          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10"
            @mouseleave="showDropdown = false"
          >
            <ul class="py-2">
              <li>
                <RouterLink to="/team" class="block px-4 py-2 text-gray-700 hover:bg-blue-100">
                  Informations sur l'équipe
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/manage-match"
                  class="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                >
                  Gérer les matchs
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/manage-members"
                  class="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                >
                  Gérer l'équipe
                </RouterLink>
              </li>
            </ul>
          </div>
          <button @click="logout" class="text-red-600 hover:text-red-800">Deconnexion</button>
        </div>
      </template>

      <!-- Si l'utilisateur n'est pas connecté, afficher ces liens -->
      <template v-else>
        <RouterLink class="text-gray-700 hover:text-blue-600" to="/login">connexion</RouterLink>
        <RouterLink class="text-gray-700 hover:text-blue-600" to="/register"
          >S'enregistrer</RouterLink
        >
      </template>
    </div>

    <!-- Menu mobile -->
    <div
      v-if="showMobileMenu"
      class="lg:hidden absolute top-0 left-0 w-full h-screen bg-white shadow-md z-20"
    >
      <div class="flex justify-between items-center p-4 border-b">
        <RouterLink to="/" class="text-xl font-bold text-blue-600">Métrolympiades</RouterLink>
        <button
          @click="showMobileMenu = false"
          class="text-gray-700 hover:text-blue-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Liens pour mobile -->
      <div class="px-4 py-2">
        <RouterLink
          to="/ranking"
          class="block text-gray-700 hover:bg-blue-100 py-2"
          @click="showMobileMenu = false"
        >
          Classement
        </RouterLink>
        <template v-if="userStore.currentUser">
          <RouterLink
            to="/dashboard"
            class="block text-gray-700 hover:bg-blue-100 py-2"
            @click="showMobileMenu = false"
          >
            Dashboard
          </RouterLink>
          <button @click="logout" class="block text-red-600 hover:bg-blue-100 py-2">
            Deconnexion
          </button>
          <div class="relative">
            <button
              @click="showDropdown = !showDropdown"
              class="block w-full text-gray-700 hover:bg-blue-100 py-2"
            >
              Mon équipe
            </button>
            <div v-if="showDropdown" class="absolute w-full bg-white shadow-lg z-10">
              <RouterLink
                to="/team"
                class="block text-gray-700 hover:bg-blue-100 py-2"
                @click="showMobileMenu = false"
              >
                Informations sur l'équipe
              </RouterLink>
              <RouterLink
                to="/manage-match"
                class="block text-gray-700 hover:bg-blue-100 py-2"
                @click="showMobileMenu = false"
              >
                Gérer les matchs
              </RouterLink>
              <RouterLink
                to="/manage-members"
                class="block text-gray-700 hover:bg-blue-100 py-2"
                @click="showMobileMenu = false"
              >
                Gérer l'équipe
              </RouterLink>
            </div>
          </div>

          
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            class="block text-gray-700 hover:bg-blue-100 py-2"
            @click="showMobileMenu = false"
          >
            Connexion
          </RouterLink>
          <RouterLink
            to="/register"
            class="block text-gray-700 hover:bg-blue-100 py-2"
            @click="showMobileMenu = false"
          >
            S'enregistrer
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>
