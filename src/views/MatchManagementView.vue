<script setup>
import { fetchApi } from '@/ApiUtil'
import MatchCard from '@/components/card/MatchCard.vue'
import TranslationText from '@/components/traductions/TranslationText.vue'
import { useLanguageStore } from '@/stores/language'
import { useUserStore } from '@/stores/user'
import { faList, faPlus, faSoccerBall, faTrash,faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onMounted, ref, watch } from 'vue'

const userStore = useUserStore()
const languageStore = useLanguageStore()

const matches = ref([])
const matchForm = ref({
  activityId: '',
  team2Id: '',
  time: '',
  team1Score: 0,
  team2Score: 0
})

const activities = ref([])
const teams = ref([])
const isScoreDisabled = ref(false)
const calculatedStartedAt = ref(null)
const teamError = ref(false)


// Load all activities and teams
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
    console.error('Error loading data:', error)
  }
}

// Load user's matches
const loadMatches = async () => {
  try {
    const matchData = await fetchApi('/matches/me', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    matches.value = matchData
  } catch (error) {
    console.error('Error loading matches:', error)
  }
}

// Create a new match
const createMatch = async () => {
  if (matchForm.value.activityId && matchForm.value.team2Id && matchForm.value.time) {

    checkIfMatchExists()
    if (teamError.value) {
      return 
    }

    try {
      const now = new Date()
      const matchTime = new Date()
      const [hours, minutes] = matchForm.value.time.split(':')
      matchTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const oneHourLater = new Date()
      oneHourLater.setHours(now.getHours() - 1)

      if (matchTime > oneHourLater) {
        isScoreDisabled.value = true
      } else {
        isScoreDisabled.value = false
      }

      await fetchApi('/matches', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userStore.token}` },
        body: JSON.stringify({
          team2Id: matchForm.value.team2Id,
          activityId: matchForm.value.activityId,
          startedAt: matchTime.toISOString(),
          team1Score: matchForm.value.team1Score,
          team2Score: matchForm.value.team2Score
        })
      })
      await loadMatches()

      matchForm.value = {
        activityId: '',
        team2Id: '',
        time: '',
        team1Score: 0,
        team2Score: 0
      }
      teamError.value = false
      calculatedStartedAt.value = null

    } catch (error) {
      console.error('Error creating match:', error)
    }
  } else {
    alert('Please fill in all required fields')
  }
}

// Delete a match by ID
const deleteMatch = async (matchId) => {
  if (confirm('Are you sure you want to delete this match?')) {
    try {
      await fetchApi(`/matches/${matchId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      loadMatches()
    } catch (error) {
      console.error('Error deleting match:', error)
    }
  }
}

onMounted(() => {
  loadData()
})

// Watch match time input to disable scores if necessary
watch(
  () => matchForm.value.time,
  (newTime) => {
    if (!newTime) {
      isScoreDisabled.value = false
      calculatedStartedAt.value = null
      return
    }

    const now = new Date()
    const [hours, minutes] = newTime.split(':')
    const matchTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(hours),
      parseInt(minutes)
    )

    const matchHour = parseInt(hours)
    const matchMinute = parseInt(minutes)
    const endMatchTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      matchHour + 1,
      matchMinute
    )
    calculatedStartedAt.value = endMatchTime

    const oneHourAgo = new Date()
    oneHourAgo.setHours(now.getHours() - 1)

    isScoreDisabled.value = matchTime > oneHourAgo
  }
)

// Check if the match already exists (same teams, same activity)
const checkIfMatchExists = () => {
  const activityId = matchForm.value.activityId;
  const team2Id = matchForm.value.team2Id;

  const selectedActivity = activities.value.find(activity => activity.id === activityId);
  const selectedTeam2 = teams.value.find(team => team.id === team2Id);

  if (selectedActivity && selectedTeam2) {
    const matchExistant = matches.value.find((m) => {
      const matchActivityName = m.activity;
      const matchTeam2Name = m.team2;
      const matchTeam1Name = m.team1;

      const isSameActivity = matchActivityName === selectedActivity.name;
      const isSameTeams = 
        (matchTeam2Name === selectedTeam2.name && matchTeam1Name === userStore.currentUser.team.name) ||
        (matchTeam2Name === userStore.currentUser.team.name && matchTeam1Name === selectedTeam2.name);

      return isSameActivity && isSameTeams;
    });

    teamError.value = !!matchExistant;
  } else {
    teamError.value = false;
  }
};



// Watch for changes in selected activity or opponent to check existing match
watch(
  () => [matchForm.value.activityId, matchForm.value.team2Id],
  () => {
    checkIfMatchExists();
  }
);


</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Bouton Gérer les activités EN DEHORS de la grande card -->
    <div class="flex justify-end mb-6">
      <RouterLink
        to="/manage-activities"
        class="theme-primary-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
      >
        <FontAwesomeIcon :icon="faPlus" />
        <TranslationText text="manageActivities" />
      </RouterLink>
    </div>

    <!-- GRANDE CARD contenant tout -->
    <div class="bg-white p-6 rounded-lg shadow-lg mb-8 space-y-8">

      <!-- En-tête de la grande card : Titre + bouton Voir mes matchs à droite -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-2">
          <FontAwesomeIcon :icon="faSoccerBall" />
          <h2 class="text-2xl font-bold theme-secondary">
            <TranslationText text="matchManagement" />
          </h2>
        </div>
        <RouterLink
          to="/matches"
          class="theme-primary-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2"
        >
          <FontAwesomeIcon :icon="faCalendarDays" />
          <TranslationText text="viewMyMatches" />
        </RouterLink>
      </div>

      <!-- FORMULAIRE pour créer un match -->
      <form @submit.prevent="createMatch" class="space-y-6">
        <div>
          <label for="activity" class="block text-sm font-medium text-gray-700 mb-2">
            <TranslationText text="activity" />
          </label>
          <select
            v-model="matchForm.activityId"
            class="border p-2 w-full rounded-lg shadow-sm focus:ring-2 ring-primary"
          >
            <option value="">{{ languageStore.translate('chooseActivity') }}</option>
            <option v-for="activity in activities" :key="activity.id" :value="activity.id">
              {{ activity.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="team2" class="block text-sm font-medium text-gray-700">
            <TranslationText text="opponentTeam" />
          </label>
          <select
            v-model="matchForm.team2Id"
            class="border p-2 w-full text-sm rounded-lg shadow-sm focus:ring-2 ring-primary"
          >
            <option value="">{{ languageStore.translate('chooseTeam') }}</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">
              {{ team.name }}
            </option>
          </select>
          <p v-if="teamError === true" class="text-sm text-red-600 mt-2 p-3 bg-red-100 border border-red-400 rounded-lg">
            <TranslationText text="matchAlreadyExistsError" />
          </p>
        </div>

        <div>
          <label for="time" class="block text-sm font-medium text-gray-700">
            <TranslationText text="matchTime" />
          </label>
          <input
            v-model="matchForm.time"
            type="time"
            class="border p-2 w-full text-sm rounded-lg shadow-sm focus:ring-2 ring-primary"
            required
          />
          <p class="mt-1 text-sm text-gray-500">
            <TranslationText text="matchToday" />
          </p>
        </div>

        <p
          v-if="isScoreDisabled"
          class="text-sm text-red-600 mt-2 p-3 bg-red-100 border border-red-400 rounded-lg"
        >
          <TranslationText
            text="scoreDisabledWarning"
            :params="{
              endTime: calculatedStartedAt
                ? calculatedStartedAt.toLocaleString(languageStore.language, { timeStyle: 'short' })
                : '',
              currentTime: new Date().toLocaleTimeString(languageStore.language, { timeStyle: 'short' })
            }"
          />
        </p>

        <!-- Inputs pour les scores -->
        <div class="flex space-x-4">
          <div class="flex-1">
            <label for="team1Score" class="block text-sm font-medium text-gray-700">
              <TranslationText text="ourScore" />
            </label>
            <input
              v-model="matchForm.team1Score"
              :disabled="isScoreDisabled"
              type="number"
              min="0"
              max="100"
              class="border p-2 w-full text-sm rounded-lg shadow-sm focus:ring-2 ring-primary"
            />
          </div>
          <div class="flex-1">
            <label for="team2Score" class="block text-sm font-medium text-gray-700">
              <TranslationText text="opponentScore" />
            </label>
            <input
              v-model="matchForm.team2Score"
              :disabled="isScoreDisabled"
              type="number"
              min="0"
              max="100"
              class="border p-2 w-full text-sm rounded-lg shadow-sm focus:ring-2 ring-primary"
            />
          </div>
        </div>

        <button
          :disabled="!matchForm.activityId || !matchForm.team2Id || !matchForm.time || isScoreDisabled || teamError === true"
          type="submit"
          class="theme-primary-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50"
        >
          <FontAwesomeIcon :icon="faPlus" />
          <TranslationText text="createMatch" />
        </button>
      </form>

      <!-- Liste des matchs existants -->
      <div>
        <h2 class="text-xl font-bold mb-4 flex items-center gap-2 theme-secondary">
          <FontAwesomeIcon :icon="faList" />
          <TranslationText text="allMatches" />
        </h2>

        <div class="space-y-4">
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

          <p v-if="matches.length === 0" class="text-center text-gray-500 py-4">
            <TranslationText text="noMatchesFound" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


