<script setup>
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TranslationText from './traductions/TranslationText.vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-4 opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 flex items-center shadow-lg"
      role="alert"
    >
      <div class="flex-grow">
        <TranslationText :text="message" />
      </div>
      <button
        @click="close"
        class="ml-4 text-red-700 hover:text-red-900 transition-colors"
      >
        <FontAwesomeIcon :icon="faXmark" />
      </button>
    </div>
  </Transition>
</template>