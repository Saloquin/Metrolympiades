<script setup>
import { ref, onMounted } from 'vue'
import { fetchApi } from '@/ApiUtil'
import { useUserStore } from '@/stores/user'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import RankingCard from '@/components/card/RankingCard.vue'

const userStore = useUserStore()
const ranking = ref([])

const loadRanking = async () => {
  try {
    const rankingData = await fetchApi('/ranking', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    ranking.value = rankingData
  } catch (error) {
    console.error('Erreur lors du chargement du classement:', error)
  }
}

onMounted(() => {
  loadRanking()
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-center theme-primary mb-6 flex items-center justify-center gap-2">
      <FontAwesomeIcon :icon="faTrophy" class="text-yellow-500" />
      Classement des équipes
    </h1>

    <div class="space-y-4">
      <RankingCard
        v-for="(team, index) in ranking"
        :key="index"
        :rank="index + 1"
        :team-name="team.team"
        :points="team.points"
      />
    </div>
  </div>
</template>