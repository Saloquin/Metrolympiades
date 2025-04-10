<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { fetchApi } from '@/ApiUtil'
import VueCal from 'vue-cal'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCalendar, faClipboard, faUserFriends, faXmark } from '@fortawesome/free-solid-svg-icons'

ChartJS.register(ArcElement, Tooltip, Legend)

const userStore = useUserStore()
const matchHistory = ref([])
const nextMatches = ref([])
const victoryCount = ref(0)
const defeatCount = ref(0)
const drawCount = ref(0)
const team = ref(userStore.currentUser?.team)
const selectedMatch = ref(null)
const showModal = ref(false)

const openMatchModal = (event) => {
  selectedMatch.value = event.originalMatch
  showModal.value = true
}
const closeMatchModal = () => {
  selectedMatch.value = null
  showModal.value = false
}

const calendarEvents = ref([])

onMounted(async () => {
  if (userStore.currentUser) {
    try {
      const matchData = await fetchApi('/matches/me', {
        headers: {
          Authorization: `Bearer ${userStore.token}`
        }
      })
      const pastMatches = matchData
        .filter((match) => new Date(match.startedAt) < new Date())
        .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))

      matchHistory.value = pastMatches.slice(0, 5)

      victoryCount.value = pastMatches.filter((match) => {
        if (team.value.name === match.team1) {
          return match.team1Score > match.team2Score
        } else {
          return match.team2Score > match.team1Score
        }
      }).length

      defeatCount.value = pastMatches.filter((match) => {
        if (team.value.name === match.team1) {
          return match.team1Score < match.team2Score
        } else {
          return match.team2Score < match.team1Score
        }
      }).length

      drawCount.value = pastMatches.filter((match) => match.team1Score === match.team2Score).length

      nextMatches.value = matchData

      // Génération des événements pour le calendrier
      calendarEvents.value = matchData.map((match) => {
        const opponent = userStore.currentUser.team === match.team1 ? match.team2 : match.team1
        return {
          start: new Date(match.startedAt),
          end: new Date(new Date(match.startedAt).getTime() + 60 * 60 * 1000), // 1h
          title: `${match.activity} vs ${opponent}`,
          originalMatch: match
        }
      })
    } catch (error) {
      // Erreur lors du chargement des matchs
    }
  }
})

// Retourner la couleur selon le résultat du match
const getResultColor = (match) => {
  if (team.value.name === match.team1) {
    if (match.team1Score > match.team2Score) return 'bg-green-300'
    if (match.team1Score < match.team2Score) return 'bg-red-300'
  } else {
    if (match.team2Score > match.team1Score) return 'bg-green-300'
    if (match.team2Score < match.team1Score) return 'bg-red-300'
  }
  return 'bg-yellow-300'
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold theme-secondary">
          Bonjour, {{ userStore.currentUser.name }}
        </h1>
        <p class="text-lg text-gray-600">Email: {{ userStore.currentUser?.email }}</p>
      </div>
      <!-- Graphique des résultats -->
      <div class="w-1/3">
        <Pie
          :data="{
            labels: ['Victoire', 'Défaite', 'Égalité'],
            datasets: [
              {
                data: [victoryCount, defeatCount, drawCount],
                backgroundColor: ['#34D399', '#F87171', '#FBBF24']
              }
            ]
          }"
          :options="{
            responsive: true,
            plugins: {
              legend: {
                position: 'top'
              },
              tooltip: {
                enabled: true
              }
            }
          }"
        />
      </div>
    </div>

    <!-- Bouton vers "InfoTeam" -->
    <div class="mb-8">
      <RouterLink
        to="/team"
        class="px-4 py-2 theme-primary-bg text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
      >
        <FontAwesomeIcon :icon="faUserFriends" class="mr-2" />
        Voir Info Team
      </RouterLink>
    </div>

    <!-- Historique des matchs -->
    <h2 class="text-2xl font-bold mb-4 theme-secondary">
      Historique des matchs <FontAwesomeIcon :icon="faClipboard" />
    </h2>
    <div class="overflow-x-auto border border-gray-300 rounded-lg mb-8">
      <table class="min-w-full table-auto mt-4 border-collapse">
        <thead>
          <tr>
            <th class="px-4 py-2 text-left">Equipe 1</th>
            <th class="px-4 py-2 text-left">Equipe 2</th>
            <th class="px-4 py-2 text-left">Activité</th>
            <th class="px-4 py-2 text-left">Score</th>
            <th class="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(match, index) in matchHistory"
            :key="index"
            :class="getResultColor(match)"
            class="border-b"
          >
            <td class="px-4 py-2">
              {{ userStore.currentUser.team.name === match.team1 ? match.team2 : match.team1 }}
            </td>
            <td class="px-4 py-2">{{ match.activity }}</td>
            <td class="px-4 py-2">{{ match.team1Score }}/{{ match.team2Score }}</td>
            <td class="px-4 py-2">{{ new Date(match.startedAt).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Prochains matchs -->
    <!-- Calendrier des prochains matchs -->
    <h2 class="text-2xl font-bold mb-4 theme-secondary">
      Calendrier des matchs <FontAwesomeIcon :icon="faCalendar" />
    </h2>
    <div class="border border-gray-300 rounded-lg p-4 mb-8">
      <VueCal
        style="height: 600px"
        default-view="month"
        :events="calendarEvents"
        :disable-views="['years', 'year', 'day']"
        :time-cell-height="22"
        @event-click="openMatchModal"
      />
    </div>

    <!-- Modal de match -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
        <button
          @click="closeMatchModal"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <FontAwesomeIcon :icon="faXmark" class="text-2xl" />
        </button>

        <h3 class="text-2xl font-bold mb-2">Détails du match</h3>
        <p><strong>Activité :</strong> {{ selectedMatch.activity }}</p>
        <p><strong>Équipes :</strong> {{ selectedMatch.team1 }} vs {{ selectedMatch.team2 }}</p>
        <p><strong>Date :</strong> {{ new Date(selectedMatch.startedAt).toLocaleString() }}</p>
        <p>
          <strong>Score :</strong> {{ selectedMatch.team1Score }} - {{ selectedMatch.team2Score }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.vuecal__event-title),
:deep(.vuecal__event-time) {
  font-size: 0.5em;
}
:deep(.vuecal__event) {
  border-radius: 0.5em;
  background-color: var(--primary-color);
  color: white;
}
:deep(.vuecal__event:hover) {
  background-color: var(--primary-color);
  opacity: 0.9;
  cursor: pointer;
}
:deep(.vuecal__cell-events-count) {
  color: white;
  background-color: var(--primary-color);
  position: absolute;
  top: 6px;
  right: 1px;
}
</style>
