<script setup>
const props = defineProps({
  match: {
    type: Object,
    required: true
  },
  isCurrentTeam: {
    type: Boolean,
    required: true
  }
})

const getScoreClass = () => {
  if (props.match.team1Score > props.match.team2Score) return 'text-green-600'
  if (props.match.team1Score < props.match.team2Score) return 'text-red-600'
  return 'text-gray-600'
}

const formatDateTime = (date) => {
  const options = { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleDateString('fr-FR', options).replace(',', ' à')
}

</script>

<template>
  <div class="bg-gray-50 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow border border-gray-100">
    <div class="flex justify-between items-center">
      <div class="space-y-2">
        <h3 class="font-medium text-lg theme-primary">
          {{ match.activity }}
        </h3>
        <p class="text-gray-600">
          vs {{ isCurrentTeam ? match.team2 : match.team1 }}
        </p>
      </div>
      <div class="text-right">
        <div :class="[getScoreClass(), 'text-xl font-bold']">
          {{ match.team1Score }} - {{ match.team2Score }}
        </div>
        <div class="text-sm text-gray-500">
            {{ formatDateTime(match.startedAt) }}
        </div>
      </div>
    </div>
  </div>
</template>