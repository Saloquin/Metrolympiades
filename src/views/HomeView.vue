<script setup>
import TranslationText from '@/components/traductions/TranslationText.vue'
import { useUserStore } from '@/stores/user'
import { faPlayCircle, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()
</script>

<template>
  <section class="text-center mt-16 px-4">
    <h1 class="text-4xl font-bold theme-secondary mb-6 sm:text-6xl">
      <TranslationText text="welcomeMessage" />
      <span class="theme-primary"> Métrolympiades</span>
    </h1>
    <p class="text-lg text-gray-600 mb-6">
      <TranslationText text="homeDescription" />
    </p>

    <div class="flex justify-center gap-6 mt-6">
      <RouterLink
        :to="userStore.isLoggedIn ? '/dashboard' : '/register'"
        class="px-6 py-3 theme-primary-bg text-white rounded-lg hover:opacity-90 transition duration-300 ease-in-out flex items-center gap-2"
      >
        <FontAwesomeIcon :icon="faPlayCircle" class="text-white h-5 w-5" />
        <span><TranslationText text="start" /></span>
      </RouterLink>

      <RouterLink
        to="/ranking"
        class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out flex items-center gap-2"
      >
        <FontAwesomeIcon :icon="faTrophy" class="text-gray-800 h-5 w-5" />
        <span><TranslationText text="viewRanking" /></span>
      </RouterLink>
    </div>
  </section>
</template>
