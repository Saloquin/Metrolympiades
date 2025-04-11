<script setup>
import { ref, onMounted } from 'vue'
import { fetchApi } from '@/ApiUtil'
import { useUserStore } from '@/stores/user'
import { faTrash, faUserPlus, faEdit } from '@fortawesome/free-solid-svg-icons' // Import des icônes
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MemberCard from '@/components/card/MemberCard.vue'

const userStore = useUserStore()
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
      //console.error('Erreur lors du chargement des données de l’équipe:', error)
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
      //console.error('Erreur lors de l\'ajout d\'un membre:', error)
    }
  }
}

// Modifier le nom de l'équipe
const updateTeamName = async () => {
  if (newTeamName.value.trim()) {
    try {
      await fetchApi('/teams/me', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userStore.token}` },
        body: JSON.stringify({ name: newTeamName.value })
      })
      team.value.name = newTeamName.value
      userStore.currentUser.team.name = newTeamName.value
    } catch (error) {
      //console.error('Erreur lors de la mise à jour du nom de l’équipe', error)
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
    //console.error('Erreur lors de la suppression du membre:', error)
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold theme-primary mb-6">Gérer l'équipe</h1>

    <!-- Section pour modifier le nom de l'équipe -->
    <div class="mt-6 mb-4">
      <h2 class="text-xl font-semibold theme-secondary">Modifier le nom de l'équipe</h2>
      <div class="flex items-center gap-4 mt-2">
        <input
          v-model="newTeamName"
          type="text"
          placeholder="Entrer le nouveau nom de l'équipe"
          class="p-2 border border-gray-300 rounded-lg w-1/2 focus:outline-none focus:ring-2 ring-primary"
        />
        <button
          @click="updateTeamName"
          class="px-4 py-2 theme-secondary-bg text-white rounded-lg hover:opacity-90 focus:outline-none transition"
        >
          <FontAwesomeIcon :icon="faEdit" class="mr-2" /> Modifier le nom d'équipe
        </button>
      </div>
    </div>

    <!-- Section pour gérer les membres -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold theme-secondary">Gérer les membres</h2>

      <div class="mt-4 flex items-center gap-4">
        <input
          v-model="newMember"
          type="text"
          placeholder="Entrer un nom"
          class="p-2 border border-gray-300 rounded-lg w-1/2 focus:outline-none focus:ring-2 ring-primary"
        />
        <button
          @click="addMember"
          class="px-4 py-2 theme-primary-bg text-white rounded-lg hover:opacity-90 focus:outline-none transition"
        >
          <FontAwesomeIcon :icon="faUserPlus" class="mr-2" /> Ajouter un Membres
        </button>
      </div>
      <div class="mt-6">
        <h3 class="text-lg theme-secondary mb-4">Membres actuels</h3>
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
          Aucun membre dans l'équipe
        </p>
      </div>
    </div>
  </div>
</template>
