<script setup>
import { ref, onMounted } from 'vue'
import { fetchApi } from '@/ApiUtil'
import { useUserStore } from '@/stores/user'
import { faTrophy, faUser, faCogs } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MemberCard from '@/components/card/MemberCard.vue'
import TranslationText from '@/components/traductions/TranslationText.vue'

const userStore = useUserStore()
const team = ref(userStore.currentUser?.team)
const victories = ref(0)

onMounted(async () => {
  if (userStore.currentUser) {
    try {
      const teamData = await fetchApi('/teams/me', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      team.value = teamData

      const matches = await fetchApi('/matches/me', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })

      victories.value = calculateVictories(matches)
    } catch (error) {
      // Erreur lors du chargement des données
    }
  }
})

const calculateVictories = (matches) => {
  let winCount = 0

  matches.forEach((match) => {
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
        <FontAwesomeIcon :icon="faUser" class="mr-2" />
        <TranslationText text="teamInfoHeader" />
      </h1>
      <div class="text-lg font-semibold theme-secondary flex items-center">
        <FontAwesomeIcon :icon="faTrophy" class="mr-2" />
        <span> <TranslationText text="victories" />: {{ victories }} </span>
      </div>
    </div>

    <!-- Section Nom d'équipe -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold theme-secondary">
        <TranslationText text="teamName" />
      </h2>
      <p class="text-lg font-semibold text-gray-900">{{ team?.name }}</p>
    </div>

    <!-- Lien vers la gestion des membres -->
    <div class="mt-6">
      <RouterLink
        to="/manage-members"
        class="px-4 py-2 theme-primary-bg text-white rounded-lg hover:opacity-90 focus:outline-none transition"
      >
        <FontAwesomeIcon :icon="faCogs" class="mr-2" />
        <TranslationText text="manageTeam" />
      </RouterLink>
    </div>

    <!-- Membres actuels -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold theme-secondary mb-4">
        <TranslationText text="currentMembers" />
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MemberCard :name="userStore.currentUser.name" :is-current-user="true" />
        <MemberCard v-for="(member, index) in team?.members" :key="index" :name="member" />
      </div>
    </div>
  </div>
</template>
