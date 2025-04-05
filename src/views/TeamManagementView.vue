<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import { useUserStore } from '@/stores/user'
import { faTrash, faUserPlus, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons' // Import des icônes
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const userStore = useUserStore()
const team = ref(userStore.currentUser?.team)
const newMember = ref('')
const newTeamName = ref('') // Nouvelle variable pour le nom de l'équipe
const newActivity = ref('') // Variable pour ajouter une nouvelle activité
const activities = ref([]) // Liste des activités de l'équipe

// Récupérer les informations de l'équipe et les activités
onMounted(async () => {
  if (userStore.currentUser) {
    try {
      // Récupérer les informations de l'équipe
      const teamResponse = await axios.get('/teams/me', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      team.value = teamResponse.data
      newTeamName.value = team.value.name // Initialiser le nom de l'équipe

      // Récupérer les activités de l'équipe
      const activitiesResponse = await axios.get('/activities', {
        headers: { Authorization: `Bearer ${userStore.token}` }
      })
      activities.value = activitiesResponse.data
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données de l’équipe ou des activités',
        error
      )
    }
  }
})

// Ajouter un membre à l'équipe
const addMember = async () => {
  if (newMember.value.trim()) {
    try {
      const updatedMembers = [...team.value.members, newMember.value]

      await axios.put(
        '/teams/me',
        { members: updatedMembers },
        { headers: { Authorization: `Bearer ${userStore.token}` } }
      )

      team.value.members = updatedMembers
      newMember.value = ''
    } catch (error) {
      console.error('Erreur lors de l’ajout d’un membre:', error)
    }
  }
}

// Modifier le nom de l'équipe
const updateTeamName = async () => {
  if (newTeamName.value.trim()) {
    try {
      await axios.put(
        '/teams/me',
        { name: newTeamName.value },
        { headers: { Authorization: `Bearer ${userStore.token}` } }
      )
      team.value.name = newTeamName.value
    } catch (error) {
      console.error('Erreur lors de la mise à jour du nom de l’équipe', error)
    }
  }
}

// Ajouter une nouvelle activité
const addActivity = async () => {
  if (newActivity.value.trim()) {
    try {
      const response = await axios.post(
        '/activities',
        { name: newActivity.value },
        { headers: { Authorization: `Bearer ${userStore.token}` } }
      )

      // Ajouter l'activité à la liste localement
      activities.value.push(response.data)

      // Réinitialiser le champ de texte
      newActivity.value = ''
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’activité:', error)
    }
  }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-blue-600 mb-6">Gérer l'équipe</h1>

    <!-- Section pour modifier le nom de l'équipe -->
    <div class="mt-6 mb-4">
      <h2 class="text-xl font-semibold text-gray-700">Modifier le nom de l'équipe</h2>
      <div class="flex items-center gap-4 mt-2">
        <input
          v-model="newTeamName"
          type="text"
          placeholder="Entrer le nouveau nom de l'équipe"
          class="p-2 border border-gray-300 rounded-lg w-1/2 focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="updateTeamName"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none transition"
        >
          <FontAwesomeIcon :icon="faEdit" class="mr-2" /> Modifier le nom d'équipe
        </button>
      </div>
    </div>

    <!-- Section pour gérer les membres -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold text-gray-700">Gérer les membres</h2>

      <div class="mt-4 flex items-center gap-4">
        <input
          v-model="newMember"
          type="text"
          placeholder="Entrer un nom"
          class="p-2 border border-gray-300 rounded-lg w-1/2 focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="addMember"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition"
        >
          <FontAwesomeIcon :icon="faUserPlus" class="mr-2" /> Ajouter un Membres
        </button>
      </div>

      <div class="mt-6">
        <h3 class="text-lg text-gray-700">Membres actuel</h3>
        <table class="min-w-full table-auto mt-4 border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">Nom des membres</th>
              <th class="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in team?.members" :key="index" class="border-b">
              <td class="px-4 py-2">{{ member }}</td>
              <td class="px-4 py-2 text-left">
                <button
                  @click="removeMember(member)"
                  class="text-red-600 hover:text-red-800 inline-flex justify-center items-center pl-6"
                >
                  <FontAwesomeIcon :icon="faTrash" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section pour ajouter des activités -->
    <!-- Section pour gérer les Activités -->
    <div class="mt-6">
      <h2 class="text-xl font-semibold text-gray-700">Gérer les Activités</h2>

      <div class="mt-4 flex items-center gap-4">
        <input
          v-model="newActivity"
          type="text"
          placeholder="Ajouter une activité"
          class="p-2 border border-gray-300 rounded-lg w-1/2 focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="addActivity"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition"
        >
          <FontAwesomeIcon :icon="faPlus" class="mr-2" /> Ajouter une Activité
        </button>
      </div>

      <div class="mt-6">
        <h3 class="text-lg text-gray-700">Activités actuelles</h3>
        <table class="min-w-full table-auto mt-4 border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">Nom de l'activité</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(activity, index) in activities" :key="index" class="border-b">
              <td class="px-4 py-2">{{ activity.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
