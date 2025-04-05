<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { useUserStore } from '@/stores/user'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'  // Import de l'icône Font Awesome
import { faTrophy, faUsers, faStar } from '@fortawesome/free-solid-svg-icons'  // Icônes des trophées, équipes et étoiles

const userStore = useUserStore()

// Tableau pour stocker les données du classement
const ranking = ref([])

// Charger le classement des équipes
const loadRanking = async () => {
  try {
    const response = await axios.get('/ranking', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    ranking.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement du classement:', error)
  }
}

onMounted(() => {
  loadRanking() // Charger le classement lors du montage du composant
})
</script>

<template>
  <div class="p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">
      <FontAwesomeIcon :icon="faTrophy" class="text-yellow-500 mr-2" />
      Classement des équipes
    </h1>

    <table class="table-auto w-full border-collapse text-left">
      <thead>
        <tr>
          <th class="border-b px-6 py-3 text-sm font-medium text-gray-700">Rang</th>
          <th class="border-b px-6 py-3 text-sm font-medium text-gray-700">Équipe</th>
          <th class="border-b px-6 py-3 text-sm font-medium text-gray-700">Points</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(team, index) in ranking" :key="index">
          <td class="border-b px-6 py-4 text-sm">{{ index + 1 }}</td>
          <td class="border-b px-6 py-4 text-sm  items-center">
            <FontAwesomeIcon :icon="faUsers" class="mr-2 text-blue-600" />
            {{ team.team }}
          </td>
          <td class="border-b px-6 py-4 text-sm  items-center">
            <FontAwesomeIcon :icon="faStar" class="mr-2 text-yellow-500" />
            {{ team.points }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
