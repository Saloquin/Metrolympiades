<script setup>
import { ref, onMounted } from 'vue'
import { fetchApi } from '@/ApiUtil'
import { useUserStore } from '@/stores/user'
import { faTrash, faUserPlus, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MemberCard from '@/components/card/MemberCard.vue'
import TranslationText from '@/components/traductions/TranslationText.vue'
import { useLanguageStore } from '@/stores/language'

const userStore = useUserStore()
const languageStore = useLanguageStore()
const team = ref(userStore.currentUser?.team)
const newMember = ref('')
const newTeamName = ref('')
const activities = ref([])

onMounted(async () => {
  if (userStore.currentUser) {
    try {
      const teamData = await fetchApi('/teams/me', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      team.value = teamData
      newTeamName.value = team.value.name

      const activitiesData = await fetchApi('/activities', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      activities.value = activitiesData
    } catch (error) {
      // Erreur lors du chargement des données
    }
  }
})

const addMember = async () => {
  if (newMember.value.trim()) {
    try {
      const updatedMembers = [...(team.value.members || []), newMember.value]

      await fetchApi('/teams/me', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userStore.token}` },
        body: JSON.stringify({ members: updatedMembers })
      })

      team.value.members = updatedMembers
      newMember.value = ''
    } catch (error) {
      // Erreur lors de l'ajout d'un membre
    }
  }
}

const updateTeamName = async () => {
  const trimmedName = newTeamName.value.trim()

  if (trimmedName) {
    try {
      // Récupération de toutes les équipes
      const teams = await fetchApi('/teams', {
        method: 'GET',
        headers: { Authorization: `Bearer ${userStore.token}` }
      })

      // Vérifie si le nom est déjà pris par une autre équipe
      const isTaken = teams.some(team =>
        team.name.toLowerCase() === trimmedName.toLowerCase() &&
        team.id !== userStore.currentUser.team.id 
      )

      if (isTaken) {
        alert('Ce nom d’équipe est déjà utilisé par une autre équipe.')
        return
      }

      // Mise à jour du nom de l'équipe
      await fetchApi('/teams/me', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userStore.token}` },
        body: JSON.stringify({ name: trimmedName })
      })

      team.value.name = trimmedName
      userStore.currentUser.team.name = trimmedName
    } catch (error) {
      
    }
  }
}


const removeMember = async (member) => {
  try {
    const updatedMembers = team.value.members.filter((m) => m !== member)

    await fetchApi('/teams/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userStore.token}` },
      body: JSON.stringify({ members: updatedMembers })
    })

    team.value.members = updatedMembers
  } catch (error) {
    // Erreur lors de la suppression du membre
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold theme-primary mb-6">
      <TranslationText text="manageTeam" />
    </h1>

    <!-- Section pour modifier le nom de l'équipe -->
    <div class="mt-6 mb-4">
      <h2 class="text-xl font-semibold theme-secondary">
        <TranslationText text="editTeamName" />
      </h2>
      <div class="flex items-center gap-4 mt-2">
        <input
          v-model="newTeamName"
          type="text"
          :placeholder="languageStore.translate('enterNewTeamName')"
          class="p-2 border border-gray-300 rounded-lg w-1/2 focus:outline-none focus:ring-2 ring-primary"
        />
        <button
          @click="updateTeamName"
          class="px-4 py-2 theme-secondary-bg text-white rounded-lg hover:opacity-90 focus:outline-none transition"
        >
          <FontAwesomeIcon :icon="faEdit" class="mr-2" />
          <TranslationText text="updateTeamName" />
        </button>
      </div>
    </div>

    <!-- Section pour gérer les membres -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold theme-secondary">
        <TranslationText text="manageMembers" />
      </h2>

      <div class="mt-4 flex items-center gap-4">
        <input
          v-model="newMember"
          type="text"
          :placeholder="languageStore.translate('enterMemberName')"
          class="p-2 border border-gray-300 rounded-lg w-1/2 focus:outline-none focus:ring-2 ring-primary"
        />
        <button
          @click="addMember"
          class="px-4 py-2 theme-primary-bg text-white rounded-lg hover:opacity-90 focus:outline-none transition"
        >
          <FontAwesomeIcon :icon="faUserPlus" class="mr-2" />
          <TranslationText text="addMember" />
        </button>
      </div>
      <div class="mt-6">
        <h3 class="text-lg theme-secondary mb-4">
          <TranslationText text="currentMembers" />
        </h3>
        <div class="space-y-4">
          <div
            v-for="(member, index) in team?.members"
            :key="index"
            class="flex items-center gap-2"
          >
            <div class="flex-grow">
              <MemberCard :name="member" :is-current-user="false" />
            </div>
            <button
              @click="removeMember(member)"
              class="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
            >
              <FontAwesomeIcon :icon="faTrash" size="lg" />
            </button>
          </div>
        </div>
        <p v-if="!team?.members?.length" class="text-center text-gray-500 py-4">
          <TranslationText text="noMembers" />
        </p>
      </div>
    </div>
  </div>
</template>
