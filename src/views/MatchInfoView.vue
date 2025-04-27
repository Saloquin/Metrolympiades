<script setup>
import { fetchApi } from '@/ApiUtil'
import MatchCard from '@/components/card/MatchCard.vue'
import TranslationText from '@/components/traductions/TranslationText.vue'
import { useUserStore } from '@/stores/user'
import { faCalendarDays, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const matches = ref([])

const loadMatches = async () => {
  try {
    const matchData = await fetchApi('/matches/me', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    matches.value = matchData.sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt))
  } catch (error) {
    console.error('Error loading matches:', error)
  }
}

onMounted(() => {
  loadMatches()
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold theme-primary flex items-center gap-2">
        <FontAwesomeIcon :icon="faCalendarDays" />
        <TranslationText text="matchList" />
      </h1>
      <RouterLink
        to="/manage-match"
        class="px-4 py-2 theme-primary-bg text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
      >
        <FontAwesomeIcon :icon="faPlus" />
        <TranslationText text="manageMatches" />
      </RouterLink>
    </div>

    <div class="space-y-4">
      <MatchCard
        v-for="(match, index) in matches"
        :key="index"
        :match="match"
        :is-current-team="userStore.currentUser.team.name === match.team1"
      />

      <p v-if="matches.length === 0" class="text-center text-gray-500 py-4">
        <TranslationText text="noMatchesFound" />
      </p>
    </div>
  </div>
</template>
