<script setup>
import { useLanguageStore } from '@/stores/language'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, onMounted, onUnmounted } from 'vue'

const languageStore = useLanguageStore()
const isOpen = ref(false)

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' }
]

const changeLanguage = (lang) => {
  languageStore.setLanguage(lang)
  isOpen.value = false
}

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

// Ferme le menu quand on clique en dehors
const closeOnClickOutside = (e) => {
  if (!e.target.closest('.language-selector')) {
    isOpen.value = false
  }
}

// Ajoute l'événement au montage du composant
onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

// Nettoie l'événement à la destruction du composant
onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>

<template>
  <div class="relative language-selector">
    <button
      @click="toggleMenu"
      class="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
    >
      <FontAwesomeIcon :icon="faGlobe" />
      <span class="hidden md:inline">{{
        languages.find((l) => l.code === languageStore.currentLanguage)?.name
      }}</span>
    </button>

    <div v-show="isOpen" class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-50">
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        :class="{ 'theme-primary': languageStore.currentLanguage === lang.code }"
      >
        {{ lang.name }}
      </button>
    </div>
  </div>
</template>
