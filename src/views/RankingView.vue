<script setup>
import { ref, onMounted } from 'vue'
import {fetchApi} from '@/ApiUtil'
import { useUserStore } from '@/stores/user'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' // Import de l'icône Font Awesome
import { faTrophy, faUsers, faStar } from '@fortawesome/free-solid-svg-icons' // Icônes des trophées, équipes et étoiles

const userStore = useUserStore()

const ranking = ref([])

const loadRanking = async () => {
  try {
    const rankingData = await fetchApi('/ranking', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    ranking.value = rankingData
  } catch (error) {
    //console.error('Erreur lors du chargement du classement:', error)
  }
}

onMounted(() => {
  loadRanking()
})
</script>

<template>
  <div class="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
    <h1
      class="text-3xl font-bold text-center theme-primary mb-6 flex items-center justify-center gap-2"
    >
      <FontAwesomeIcon :icon="faTrophy" class="text-yellow-500" />
      Classement des équipes
    </h1>

    <table class="table-auto w-full border-collapse text-left">
      <thead>
        <tr>
          <th class="border-b px-6 py-3 text-sm font-medium theme-secondary">Rang</th>
          <th class="border-b px-6 py-3 text-sm font-medium theme-secondary">Équipe</th>
          <th class="border-b px-6 py-3 text-sm font-medium theme-secondary">Points</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(team, index) in ranking"
          :key="index"
          class="hover:bg-gray-50 transition-colors"
        >
          <td class="border-b px-6 py-4 text-sm">
            <span
              :class="{
                'theme-primary font-bold': index < 3,
                'text-gray-600': index >= 3
              }"
            >
              {{ index + 1 }}
            </span>
          </td>
          <td class="border-b px-6 py-4 text-sm items-center">
            <FontAwesomeIcon :icon="faUsers" class="mr-2 theme-primary" />
            {{ team.team }}
          </td>
          <td class="border-b px-6 py-4 text-sm items-center">
            <FontAwesomeIcon :icon="faStar" class="mr-2 theme-secondary" />
            {{ team.points }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
