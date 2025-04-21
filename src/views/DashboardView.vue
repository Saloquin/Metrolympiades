<script setup>
import { fetchApi } from '@/ApiUtil'
import MatchHistoryCard from '@/components/card/MatchHistoryCard.vue'
import TranslationText from '@/components/traductions/TranslationText.vue'
import { useLanguageStore } from '@/stores/language'
import { useUserStore } from '@/stores/user'
import {
  faCalendar,
  faClipboard,
  faTrophy,
  faUserFriends,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { onMounted, ref, watch } from 'vue'
import VueCal from 'vue-cal'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const userStore = useUserStore()
const languageStore = useLanguageStore()
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

const today = new Date()
const isTodayView = ref(true)

const handleViewChange = ({ startDate }) => {
  const selectedDate = new Date(startDate)
  const todayDate = new Date(today)
  isTodayView.value = selectedDate.toDateString() === todayDate.toDateString()

  if (selectedDate > today) {
    vueCalRef.value?.scrollToTime?.('00:00')
    vueCalRef.value?.goToDate(today)
  }
}

const vueCalRef = ref(null)

const updateArrowState = (isToday) => {
  const nextArrow = document.querySelector('.vuecal__arrow--next')
  if (nextArrow) {
    if (isToday) {
      nextArrow.classList.add('disabled-arrow')
    } else {
      nextArrow.classList.remove('disabled-arrow')
    }
  }
}

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

      calendarEvents.value = matchData.map((match) => {
        const opponent = userStore.currentUser.team === match.team1 ? match.team2 : match.team1
        return {
          start: new Date(match.startedAt),
          end: new Date(new Date(match.startedAt).getTime() + 60 * 60 * 1000),
          title: `${match.activity} vs ${opponent}`,
          originalMatch: match
        }
      })

      
      updateArrowState(isTodayView.value)

    } catch (error) {
      // Gérer l'erreur
    }
  }
})


watch(isTodayView, (newVal) => {
  updateArrowState(newVal)
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Header + Pie Chart -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold theme-secondary">
          <TranslationText
            text="dashboardGreeting"
            :params="{ name: userStore.currentUser.name }"
          />
        </h1>
        <p class="text-lg text-gray-600">
          <TranslationText text="email" />: {{ userStore.currentUser?.email }}
        </p>
      </div>
      <div class="w-1/3">
        <Pie
          :data="{
            labels: [
              languageStore.translate('victory'),
              languageStore.translate('defeat'),
              languageStore.translate('draw')
            ],
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

    <!-- Boutons -->
    <div class="mb-8 flex gap-4">
      <RouterLink
        to="/team"
        class="px-4 py-2 theme-primary-bg text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
      >
        <FontAwesomeIcon :icon="faUserFriends" class="mr-2" />
        <TranslationText text="viewTeamInfo" />
      </RouterLink>
      <RouterLink
        to="/ranking"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-opacity flex items-center"
      >
        <FontAwesomeIcon :icon="faTrophy" class="mr-2" />
        <TranslationText text="viewRanking" />
      </RouterLink>
    </div>

    <!-- Historique -->
    <h2 class="text-2xl font-bold mb-4 theme-secondary">
      <TranslationText text="matchHistory" /> <FontAwesomeIcon :icon="faClipboard" />
    </h2>
    <div class="space-y-4 mb-8">
      <MatchHistoryCard
        v-for="(match, index) in matchHistory"
        :key="index"
        :match="match"
        :is-current-team="userStore.currentUser.team.name === match.team1"
      />
      <p v-if="matchHistory.length === 0" class="text-center text-gray-500 py-4">
        <TranslationText text="noMatchHistory" />
      </p>
    </div>

    <!-- Calendrier -->
    <h2 class="text-2xl font-bold mb-4 theme-secondary">
      <TranslationText text="matchCalendar" /> <FontAwesomeIcon :icon="faCalendar" />
    </h2>
    <div class="border border-gray-300 rounded-lg p-4 mb-8">
      <VueCal
        ref="vueCalRef"
        style="height: 600px"
        :default-view="'day'"
        :active-view="'day'"
        :events="calendarEvents"
        :disable-views="['years', 'year', 'month', 'week']"
        :time-cell-height="22"
        :editable-events="false"
        :enable-date-change="false"
        @event-click="openMatchModal"
        @view-change="handleViewChange"
      />
    </div>

    <!-- Modal -->
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
        <h3 class="text-2xl font-bold mb-2">
          <TranslationText text="matchDetails" />
        </h3>
        <p><strong><TranslationText text="activity" />:</strong> {{ selectedMatch.activity }}</p>
        <p>
          <strong><TranslationText text="teams" />:</strong>
          {{ selectedMatch.team1 }} vs {{ selectedMatch.team2 }}
        </p>
        <p>
          <strong><TranslationText text="date" />:</strong>
          {{ new Date(selectedMatch.startedAt).toLocaleString() }}
        </p>
        <p>
          <strong><TranslationText text="score" />:</strong>
          {{ selectedMatch.team1Score }} - {{ selectedMatch.team2Score }}
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
:deep(.vuecal__arrow.vuecal__arrow--next.disabled-arrow) {
  display: none !important;
}
</style>
