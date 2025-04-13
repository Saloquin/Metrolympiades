<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useThemeStore } from '@/stores/theme'

const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()
const showMobileMenu = ref(false)
const showInfoDropdown = ref(false)
const showManageDropdown = ref(false)
const timeoutId = ref(null)

const logout = () => {
  showMobileMenu.value = false
  userStore.logout()
  themeStore.initializeFontSizeOnly()
  router.push('/')
}
const handleDropdownHover = (dropdown, isHovered) => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }

  if (isHovered) {
    if (dropdown === 'info') {
      showInfoDropdown.value = true
      showManageDropdown.value = false
    } else if (dropdown === 'manage') {
      showManageDropdown.value = true
      showInfoDropdown.value = false
    }
  } else {
    timeoutId.value = setTimeout(() => {
      if (dropdown === 'info') {
        showInfoDropdown.value = false
      } else if (dropdown === 'manage') {
        showManageDropdown.value = false
      }
    }, 150) // Délai de 150ms avant de fermer
  }
}
</script>

<template>
  <nav class="bg-white shadow-md py-3 px-6 flex justify-between items-center relative">
    <div class="flex items-center gap-4">
      <RouterLink to="/" class="text-xl font-bold theme-primary">Métrolympiades</RouterLink>
      <span
        v-if="userStore.currentUser"
        class="text-xl theme-secondary font-semibold hidden lg:block"
      >
        {{ userStore.currentUser.team.name }}
      </span>
    </div>

    <!-- Menu mobile toggle -->
    <button
      @click="showMobileMenu = !showMobileMenu"
      class="lg:hidden text-gray-700 hover:text-secondary focus:outline-none"
    >
      <FontAwesomeIcon :icon="faBars" class="h-6 w-6" />
    </button>

    <!-- Desktop menu -->
    <div class="hidden lg:flex gap-4 items-center">
      <RouterLink class="text-gray-700 hover:text-primary" to="/ranking">Classement</RouterLink>

      <template v-if="userStore.currentUser">
        <RouterLink class="text-gray-700 hover:text-primary" to="/dashboard">Dashboard</RouterLink>

        <!-- Mes Infos Dropdown -->
        <div
          class="relative"
          @mouseenter="handleDropdownHover('info', true)"
          @mouseleave="handleDropdownHover('info', false)"
        >
          <button
            class="text-gray-700 hover:text-secondary focus:outline-none flex items-center gap-1"
          >
            Mes Infos
            <FontAwesomeIcon :icon="faChevronDown" class="h-4 w-4" />
          </button>
          <div
            v-if="showInfoDropdown"
            class="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-[200px]"
          >
            <ul class="py-2">
              <li>
                <RouterLink
                  to="/team"
                  class="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-150"
                >
                  Mon équipe
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/matches"
                  class="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-150"
                >
                  Mes matchs
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Management Dropdown -->
        <div
          class="relative"
          @mouseenter="handleDropdownHover('manage', true)"
          @mouseleave="handleDropdownHover('manage', false)"
        >
          <button
            class="text-gray-700 hover:text-secondary focus:outline-none flex items-center gap-1"
          >
            Management
            <FontAwesomeIcon :icon="faChevronDown" class="h-4 w-4" />
          </button>
          <div
            v-if="showManageDropdown"
            class="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-[200px]"
          >
            <ul class="py-2">
              <li>
                <RouterLink
                  to="/manage-members"
                  class="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-150"
                >
                  Gérer l'équipe
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/manage-match"
                  class="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-150"
                >
                  Gérer les matchs
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <button @click="logout" class="text-red-600 hover:text-red-800">Déconnexion</button>
      </template>

      <template v-else>
        <RouterLink class="text-gray-700 hover:theme-primary" to="/login">Connexion</RouterLink>
        <RouterLink class="text-gray-700 hover:theme-primary" to="/register"
          >S'enregistrer</RouterLink
        >
      </template>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="showMobileMenu"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
      @click="showMobileMenu = false"
    >
      <div class="absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform" @click.stop>
        <!-- Mobile Header -->
        <div class="p-4 border-b flex justify-between items-center">
          <span v-if="userStore.currentUser" class="theme-secondary font-semibold truncate">
            {{ userStore.currentUser.team.name }}
          </span>
          <button @click="showMobileMenu = false" class="text-gray-600 hover:text-gray-800">
            <FontAwesomeIcon :icon="faTimes" class="h-6 w-6" />
          </button>
        </div>

        <!-- Mobile Navigation -->
        <div class="py-4">
          <RouterLink
            to="/ranking"
            class="block px-4 py-2 text-gray-700 hover:theme-primary"
            @click="showMobileMenu = false"
          >
            Classement
          </RouterLink>

          <template v-if="userStore.currentUser">
            <!-- Mes Infos Section -->
            <div class="px-4 py-2 border-t">
              <div class="font-medium text-gray-700 mb-2">Mes Infos</div>
              <RouterLink
                to="/team"
                class="block pl-4 py-2 text-gray-600 hover:theme-primary"
                @click="showMobileMenu = false"
              >
                Mon équipe
              </RouterLink>
              <RouterLink
                to="/next-matches"
                class="block pl-4 py-2 text-gray-600 hover:theme-primary"
                @click="showMobileMenu = false"
              >
                Mes matchs
              </RouterLink>
            </div>

            <!-- Management Section -->
            <div class="px-4 py-2 border-t border-b">
              <div class="font-medium text-gray-700 mb-2">Management</div>
              <RouterLink
                to="/manage-members"
                class="block pl-4 py-2 text-gray-600 hover:theme-primary"
                @click="showMobileMenu = false"
              >
                Gérer l'équipe
              </RouterLink>
              <RouterLink
                to="/manage-match"
                class="block pl-4 py-2 text-gray-600 hover:theme-primary"
                @click="showMobileMenu = false"
              >
                Gérer les matchs
              </RouterLink>
            </div>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="block px-4 py-2 text-gray-700 hover:theme-primary"
              @click="showMobileMenu = false"
            >
              Connexion
            </RouterLink>
            <RouterLink
              to="/register"
              class="block px-4 py-2 text-gray-700 hover:theme-primary"
              @click="showMobileMenu = false"
            >
              S'enregistrer
            </RouterLink>
          </template>
          <div class="px-4 py-2">
            <button @click="logout" class="text-red-600 hover:text-red-800">Déconnexion</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
