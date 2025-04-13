<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUsers, faStar } from '@fortawesome/free-solid-svg-icons'

defineProps({
  rank: {
    type: Number,
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="bg-gray-50 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow border border-gray-100">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span
          :class="{
            'theme-secondary font-bold text-xl': rank <= 3,
            'text-gray-600 text-lg': rank > 3
          }"
        >
          #{{ rank }}
        </span>
        <div class="flex items-center gap-2">
          <FontAwesomeIcon :icon="faUsers" class="theme-primary" />
          <span class="font-medium">{{ teamName }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <FontAwesomeIcon :icon="faStar" class="theme-secondary" />
        <span class="font-bold">{{ points }}</span>
      </div>
    </div>
  </div>
</template>