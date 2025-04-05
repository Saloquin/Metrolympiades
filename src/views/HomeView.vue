<script setup>
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'  // Importer le store pour vérifier si l'utilisateur est connecté
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'  // Importer l'icône FontAwesome
import { faPlayCircle, faTrophy } from '@fortawesome/free-solid-svg-icons'  // Importer les icônes nécessaires
const userStore = useUserStore()  // Créer une instance du store pour l'utiliser dans le composant
</script>

<template>
    <section class="text-center mt-16 px-4">
      <h1 class="text-5xl font-bold text-yellow-500 mb-6">
        Bienvenue sur <span class="text-blue-700">Métrolympiades</span>
      </h1>
      <p class="text-lg text-gray-600 mb-6">Gérez facilement et efficacement votre journée de team building.</p>
  
      <div class="flex justify-center gap-6 mt-6">
        <!-- Lien conditionnel en fonction de l'état de connexion de l'utilisateur -->
        <RouterLink
          :to="userStore.isLoggedIn ? '/dashboard' : '/register'"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out flex items-center gap-2"
        >
          <FontAwesomeIcon :icon="faPlayCircle" class="text-white h-5 w-5" />
          <span>Commencer</span>
        </RouterLink>
  
        <!-- Lien vers le classement -->
        <RouterLink
          to="/ranking"
          class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out flex items-center gap-2"
        >
          <FontAwesomeIcon :icon="faTrophy" class="text-gray-800 h-5 w-5" />
          <span>Voir le classement</span>
        </RouterLink>
      </div>
    </section>
  </template>
