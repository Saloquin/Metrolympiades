<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { fetchApi } from '@/ApiUtil'
import MatchCard from '@/components/card/MatchCard.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faTrash,
  faPlus,
  faSoccerBall,
  faList,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons'

const userStore = useUserStore()
const isActivitySectionOpen = ref(false)

const matches = ref([])
const matchForm = ref({
  activityId: '',
  team2Id: '',
  time: '',
  team1Score: 0,
  team2Score: 0
})
const newActivity = ref('')

const activities = ref([])
const teams = ref([])

const loadData = async () => {
  try {
    const activityData = await fetchApi('/activities', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    activities.value = activityData

    const teamData = await fetchApi('/teams', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    teams.value = teamData.filter((team) => team.id !== userStore.currentUser.team.id)

    await loadMatches()
  } catch (error) {
    // console.error('Erreur lors du chargement des données:', error)
  }
}

const loadMatches = async () => {
  try {
    const matchData = await fetchApi('/matches/me', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    matches.value = matchData
  } catch (error) {
    //console.error('Erreur lors du chargement des matchs:', error)
  }
}

const createMatch = async () => {
  if (matchForm.value.activityId && matchForm.value.team2Id && matchForm.value.time) {
    try {
      const today = new Date()
      const [hours, minutes] = matchForm.value.time.split(':')
      today.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      await fetchApi('/matches', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userStore.token}` },
        body: JSON.stringify({
          team2Id: matchForm.value.team2Id,
          activityId: matchForm.value.activityId,
          startedAt: today.toISOString(),
          team1Score: matchForm.value.team1Score,
          team2Score: matchForm.value.team2Score
        })
      })
      loadMatches()
    } catch (error) {
      //console.error('Erreur lors de la création du match:', error)
    }
  } else {
    alert('Veuillez remplir tous les champs nécessaires')
  }
}

const deleteMatch = async (matchId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce match ?')) {
    try {
      await fetchApi(`/matches/${matchId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      loadMatches()
    } catch (error) {
      //  console.error('Erreur lors de la suppression du match:', error)
    }
  }
}

const addActivity = async () => {
  if (newActivity.value.trim()) {
    try {
      const response = await fetchApi('/activities', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userStore.token}` },
        body: JSON.stringify({ name: newActivity.value })
      })
      activities.value.push(response)

      newActivity.value = ''
    } catch (error) {
      //console.error('Erreur lors de l’ajout de l’activité:', error)
    }
  }
}

const toggleActivitySection = () => {
  isActivitySectionOpen.value = !isActivitySectionOpen.value
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
      <div @click="toggleActivitySection" class="flex items-center justify-between cursor-pointer">
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 theme-secondary">
          <FontAwesomeIcon :icon="faList" />
          <span>Gérer les Activités</span>
        </h2>
        <FontAwesomeIcon
          :icon="isActivitySectionOpen ? faChevronUp : faChevronDown"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        />
      </div>

      <div v-show="isActivitySectionOpen" class="space-y-6">
        <div class="flex items-center gap-4 mb-6">
          <input
            v-model="newActivity"
            type="text"
            placeholder="Ajouter une activité"
            class="p-2 border border-gray-300 rounded-lg flex-1 focus:ring-2 ring-primary"
          />
          <button
            @click="addActivity"
            class="theme-primary-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2 whitespace-nowrap"
          >
            <FontAwesomeIcon :icon="faPlus" />
            <span>Ajouter</span>
          </button>
        </div>

        <div v-if="activities.length > 0">
          <h3 class="text-lg font-semibold mb-4 theme-secondary">Activités actuelles</h3>
          <table class="min-w-full table-auto border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-2 text-left theme-primary">Nom de l'activité</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in activities" :key="activity.id" class="border-b">
                <td class="px-4 py-2">{{ activity.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <h1 class="text-2xl font-bold mb-4 flex items-center gap-2 theme-primary">
      <FontAwesomeIcon :icon="faSoccerBall" />
      <span>Gestion des Matchs</span>
    </h1>

    <!-- Formulaire pour créer un match -->
    <form @submit.prevent="createMatch" class="space-y-6 mb-8 bg-white p-6 rounded-lg shadow-lg">
      <div>
        <label for="activity" class="block text-sm font-medium text-gray-700 mb-2">Activité</label>
        <select
          v-model="matchForm.activityId"
          class="border p-2 w-full rounded-lg shadow-sm focus:ring-2 ring-primary"
        >
          <option value="">Choisir une activité</option>
          <option v-for="activity in activities" :key="activity.id" :value="activity.id">
            {{ activity.name }}
          </option>
        </select>
      </div>

      <div>
        <label for="team2" class="block text-sm font-medium text-gray-700">Équipe adverse</label>
        <select
          v-model="matchForm.team2Id"
          class="focus:ring-2 ring-primary border p-2 w-full text-sm rounded-lg shadow-sm"
        >
          <option value="">Choisir une équipe</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
        </select>
      </div>

      <div>
        <label for="time" class="block text-sm font-medium text-gray-700">Heure du match</label>
        <input
          v-model="matchForm.time"
          type="time"
          class="border p-2 w-full text-sm rounded-lg shadow-sm focus:ring-2 ring-primary"
          required
        />
        <p class="mt-1 text-sm text-gray-500">Le match sera programmé pour aujourd'hui</p>
      </div>

      <!-- Score -->
      <div class="flex space-x-4">
        <div class="flex-1">
          <label for="team1Score" class="block text-sm font-medium text-gray-700"
            >Notre score</label
          >
          <input
            v-model="matchForm.team1Score"
            type="number"
            min="0"
            max="100"
            class="border p-2 w-full text-sm rounded-lg shadow-sm focus:ring-2 ring-primary"
          />
        </div>
        <div class="flex-1">
          <label for="team2Score" class="block text-sm font-medium text-gray-700"
            >Score adverse</label
          >
          <input
            v-model="matchForm.team2Score"
            type="number"
            min="0"
            max="100"
            class="border p-2 w-full text-sm rounded-lg shadow-sm focus:ring-2 ring-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        class="theme-primary-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
      >
        <FontAwesomeIcon :icon="faPlus" />
        <span>Créer le match</span>
      </button>
    </form>

    <!-- Tableau des matchs -->
    <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 class="text-xl font-bold mb-4 flex items-center gap-2 theme-secondary">
        <FontAwesomeIcon :icon="faList" />
        <span>Tous les matchs</span>
      </h2>

      <div class="space-y-4 ">
        <div v-for="match in matches" :key="match.id" class="flex items-center gap-4">
          <div class="flex-grow">
            <MatchCard
              :match="match"
              :is-current-team="userStore.currentUser.team.name === match.team1"
            />
          </div>
          <button
            @click="deleteMatch(match.id)"
            class="text-red-600 hover:text-red-800 transition-colors p-2"
          >
            <FontAwesomeIcon :icon="faTrash" size="lg" />
          </button>
        </div>

        <p v-if="matches.length === 0" class="text-center text-gray-500 py-4">Aucun match trouvé</p>
      </div>
    </div>
  </div>
</template>
