<script setup>
import { ref, onMounted } from 'vue'
import { fetchApi } from '@/ApiUtil'
import { useUserStore } from '@/stores/user'
import { useLanguageStore } from '@/stores/language'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ActivityCard from '@/components/card/ActivityCard.vue'

const userStore = useUserStore()
const languageStore = useLanguageStore()
const activities = ref([])
const newActivity = ref('')

const loadActivities = async () => {
  try {
    const activityData = await fetchApi('/activities', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    })
    activities.value = activityData
  } catch (error) {
    console.error('Error loading activities:', error)
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
      console.error('Error adding activity:', error)
    }
  }
}

onMounted(() => {
  loadActivities()
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold theme-primary mb-6">
      <TranslationText text="manageActivities" />
    </h1>

    <div class="flex items-center gap-4 mb-6">
      <input
        v-model="newActivity"
        type="text"
        :placeholder="languageStore.translate('addActivity')"
        class="p-2 border border-gray-300 rounded-lg flex-1 focus:ring-2 ring-primary"
      />
      <button
        @click="addActivity"
        class="theme-primary-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center gap-2 whitespace-nowrap"
      >
        <FontAwesomeIcon :icon="faPlus" />
        <TranslationText text="add" />
      </button>
    </div>

    <div v-if="activities.length > 0" class="space-y-4">
      <h3 class="text-lg font-semibold mb-4 theme-secondary">
        <TranslationText text="currentActivities" />
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActivityCard v-for="activity in activities" :key="activity.id" :activity="activity" />
      </div>
    </div>

    <p v-else class="text-center text-gray-500 py-4">
      <TranslationText text="noActivities" />
    </p>
  </div>
</template>
