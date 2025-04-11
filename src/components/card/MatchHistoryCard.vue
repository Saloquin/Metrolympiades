<script setup>
import { defineProps } from 'vue'

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

const getResultColor = () => {
  if (props.isCurrentTeam) {
    if (props.match.team1Score > props.match.team2Score) return 'bg-green-100 border-green-400'
    if (props.match.team1Score < props.match.team2Score) return 'bg-red-100 border-red-400'
  } else {
    if (props.match.team2Score > props.match.team1Score) return 'bg-green-100 border-green-400'
    if (props.match.team2Score < props.match.team1Score) return 'bg-red-100 border-red-400'
  }
  return 'bg-yellow-100 border-yellow-400'
}
</script>

<template>
  <div 
    :class="[getResultColor(), 'bg-gray-50 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow border border-gray-100']"
  >
    <div class="flex justify-between items-center">
      <div class="space-y-1">
        <h3 class="font-medium text-gray-800">
          {{ match.activity }}
        </h3>
        <p class="text-sm text-gray-600">
          vs {{ isCurrentTeam ? match.team2 : match.team1 }}
        </p>
      </div>
      <div class="text-right">
        <div class="text-lg font-bold theme-primary">
          {{ match.team1Score }} - {{ match.team2Score }}
        </div>
        <div class="text-sm text-gray-500">
          {{ new Date(match.startedAt).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>