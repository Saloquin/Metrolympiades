<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useThemeStore } from '@/stores/theme'
const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()
const showDropdown = ref(false)
const showMobileMenu = ref(false)

const logout = () => {
  showMobileMenu.value = false
  userStore.logout()
  themeStore.initializeFontSizeOnly()
  router.push('/')
}
</script>

<template>
  <nav class="bg-white shadow-md py-3 px-6 flex justify-between items-center relative">
    <!-- Replace blue-600 with theme-primary -->
    <RouterLink to="/" class="text-xl font-bold theme-primary">Métrolympiades</RouterLink>

    <!-- Menu mobile toggle -->
    <button
      @click="showMobileMenu = !showMobileMenu"
      class="lg:hidden text-gray-700 hover:theme-primary focus:outline-none"
    >
    <FontAwesomeIcon :icon="faBars" class="h-6 w-6" />

    </button>

    <div class="flex gap-4 items-center hidden lg:flex">
      <!-- Replace all blue-600/blue-100 with theme-primary/theme-secondary -->
      <RouterLink class="text-gray-700 hover:theme-primary" to="/ranking">Classement</RouterLink>

      <template v-if="userStore.currentUser">
        <RouterLink class="text-gray-700 hover:theme-primary" to="/dashboard">Dashboard</RouterLink>

        <div class="relative">
          <button
            @mouseenter="showDropdown = true"
            class="text-gray-700 hover:theme-primary focus:outline-none"
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
                <RouterLink to="/team" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Informations sur l'équipe
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/manage-match"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Gérer les matchs
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/manage-members"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Gérer l'équipe
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
        <button @click="logout" class="text-red-600 hover:text-red-800">Deconnexion</button>
      </template>

      <template v-else>
        <RouterLink class="text-gray-700 hover:theme-primary" to="/login">connexion</RouterLink>
        <RouterLink class="text-gray-700 hover:theme-primary" to="/register"
          >S'enregistrer</RouterLink
        >
      </template>
    </div>

    <!-- Mobile menu stays mostly the same, just update hover colors -->
    <div
      v-if="showMobileMenu"
      class="lg:hidden absolute top-0 left-0 w-full h-screen bg-white shadow-md z-20"
    >
      <div class="flex justify-between items-center p-4 border-b">
        <RouterLink to="/" class="text-xl font-bold theme-primary">Métrolympiades</RouterLink>
        <!-- ... rest of mobile menu ... -->
      </div>
    </div>
  </nav>
</template>