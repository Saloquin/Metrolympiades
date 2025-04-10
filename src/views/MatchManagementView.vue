<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import {fetchApi} from '@/ApiUtil'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash, faPlus, faSoccerBall, faList } from '@fortawesome/free-solid-svg-icons'

const userStore = useUserStore()

const matches = ref([])
const matchForm = ref({
  activityId: '',
  team2Id: '',
  startedAt: '', 
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
    console.error('Erreur lors du chargement des données:', error)
  }
}

const loadMatches = async () => {
  try {
    const matchData = await fetchApi('/matches/me', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    matches.value = matchData
  } catch (error) {
    console.error('Erreur lors du chargement des matchs:', error)
  }
}

const createMatch = async () => {
  if (matchForm.value.activityId && matchForm.value.team2Id && matchForm.value.startedAt) {
    try {
      await fetchApi('/matches', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userStore.token}` },
        body: JSON.stringify({
          team2Id: matchForm.value.team2Id,
          activityId: matchForm.value.activityId,
          startedAt: new Date(matchForm.value.startedAt).toISOString(),
          team1Score: matchForm.value.team1Score,
          team2Score: matchForm.value.team2Score
        })
      })
      loadMatches()
    } catch (error) {
      console.error('Erreur lors de la création du match:', error)
      alert('Erreur lors de la création du match')
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
      console.error('Erreur lors de la suppression du match:', error)
      alert('Erreur lors de la suppression du match')
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
      console.error('Erreur lors de l’ajout de l’activité:', error)
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4 flex items-center gap-2 theme-primary">
      <FontAwesomeIcon :icon="faSoccerBall" />
      <span>Gestion des Matchs</span>
    </h1>

    <!-- Formulaire pour créer un match -->
    <form @submit.prevent="createMatch" class="space-y-6 mb-8 bg-gray-50 p-6 rounded-lg shadow-lg">
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
        <select v-model="matchForm.team2Id" class="focus:ring-2 ring-primary border p-2 w-full text-sm rounded-lg shadow-sm">
          <option value="">Choisir une équipe</option>
          <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
        </select>
      </div>

      <div>
        <label for="startedAt" class="block text-sm font-medium text-gray-700">Date du match</label>
        <input
          v-model="matchForm.startedAt"
          type="datetime-local"
          class="border p-2 w-full text-sm rounded-lg shadow-sm focus:ring-2 ring-primary"
        />
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
      <table class="min-w-full table-auto border-collapse text-sm">
        <thead>
          <tr class="bg-gray-50">
            <th class="border px-4 py-2 text-left theme-primary">Équipe 1</th>
            <th class="border px-4 py-2 text-left theme-primary">Équipe 2</th>
            <th class="border px-4 py-2 text-left theme-primary">Activité</th>
            <th class="border px-4 py-2 text-left theme-primary">Date</th>
            <th class="border px-4 py-2 text-left theme-primary">Score</th>
            <th class="border px-4 py-2 text-left theme-primary">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="match in matches" :key="match.id">
            <td class="border px-4 py-2">{{ match.team1 }}</td>
            <td class="border px-4 py-2">{{ match.team2 }}</td>
            <td class="border px-4 py-2">{{ match.activity }}</td>
            <td class="border px-4 py-2">{{ new Date(match.startedAt).toLocaleString() }}</td>
            <td class="border px-4 py-2">{{ match.team1Score }}/{{ match.team2Score }}</td>
            <td class="border px-4 py-2 text-red-600 hover:text-red-800 cursor-pointer">
              <div class="flex items-center justify-center h-full" @click="deleteMatch(match.id)">
                <FontAwesomeIcon :icon="faTrash" class="mx-4" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-bold mb-4 theme-secondary flex items-center gap-2">
        <FontAwesomeIcon :icon="faPlus" />
        <span>Gérer les Activités</span>
      </h2>

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
          <span>Ajouter une Activité</span>
        </button>
      </div>

      <div>
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
</template>
