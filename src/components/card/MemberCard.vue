<script setup>
import { defineProps } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import TranslationText from '@/components/traductions/TranslationText.vue'

defineProps({
  name: {
    type: String,
    required: true
  },
  isCurrentUser: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    class="bg-gray-50 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow border border-gray-100"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center theme-primary"
      >
        <FontAwesomeIcon :icon="faUser" size="lg" />
      </div>
      <div>
        <p class="font-medium text-gray-900">
          {{ name }}
          <span v-if="isCurrentUser" class="ml-2 text-sm text-gray-500">
            (<TranslationText text="you" />)
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
