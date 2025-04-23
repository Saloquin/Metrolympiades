<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faRunning } from '@fortawesome/free-solid-svg-icons'

defineProps({
  activity: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <div class="flex items-center gap-3">
      <div class="p-3 rounded-full theme-primary-bg text-white">
        <FontAwesomeIcon :icon="faRunning" class="text-xl" />
      </div>
      <div class="flex-grow">
        <h3 class="font-semibold theme-secondary text-lg">{{ activity.name }}</h3>
      </div>
    </div>
  </div>
</template>
