<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { useUserStore } from '@/stores/user'
import { faTrophy, faUser, faCogs } from '@fortawesome/free-solid-svg-icons' // Icône pour les victoires
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const userStore = useUserStore()
const team = ref(userStore.currentUser?.team)
const victories = ref(0) // Nombre de victoires

// Récupérer les informations de l'équipe et les matchs
onMounted(async () => {
  if (userStore.currentUser) {
    try {
      // Récupérer les informations de l'équipe
      const response = await axios.get('/teams/me', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      team.value = response.data

      // Récupérer les matchs de l'équipe
      const matchResponse = await axios.get('/matches/me', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      const matches = matchResponse.data

      // Calculer le nombre de victoires
      victories.value = calculateVictories(matches)
    } catch (error) {
      console.error('Erreur lors de la récupération des données de l’équipe', error)
    }
  }
})

// Fonction pour calculer le nombre de victoires
const calculateVictories = (matches) => {
  let winCount = 0

  matches.forEach((match) => {
    // Vérifier si l'équipe est team1 ou team2
    if (team.value.name === match.team1 && match.team1Score > match.team2Score) {
      winCount += 1
    } else if (team.value.name === match.team2 && match.team2Score > match.team1Score) {
      winCount += 1
    }
  })

  return winCount
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
    <!-- Header avec les informations -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold theme-primary flex items-center">
        <FontAwesomeIcon :icon="faUser" class="mr-2" /> Informations sur l'équipe
      </h1>
      <div class="text-lg font-semibold theme-secondary flex items-center">
        <FontAwesomeIcon :icon="faTrophy" class="mr-2" />
        <span>Victoires: {{ victories }}</span>
      </div>
    </div>

    <!-- Section Nom d'équipe -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold theme-secondary">Nom d'équipe</h2>
      <p class="text-lg font-semibold text-gray-900">{{ team?.name }}</p>
    </div>

    <!-- Lien vers la gestion des membres -->
    <div class="mt-6">
      <RouterLink
        to="/manage-members"
        class="px-4 py-2 theme-primary-bg text-white rounded-lg hover:opacity-90 focus:outline-none transition"
      >
        <FontAwesomeIcon :icon="faCogs" class="mr-2" />
        Gerer l'équipe
      </RouterLink>
    </div>

    <!-- Section Membres -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold theme-secondary">Membres actuels</h2>
      <table class="min-w-full table-auto mt-4 border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 text-left theme-primary">Nom des membres</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(member, index) in team?.members" :key="index" class="border-b">
            <td class="px-4 py-2">{{ member }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
