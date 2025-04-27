<script setup>
import { useLanguageStore } from '@/stores/language'
import { computed } from 'vue'

const props = defineProps({
  // Clé de traduction
  text: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    default: () => ({})
  },
  uppercase: {
    type: Boolean,
    default: false
  },
  lowercase: {
    type: Boolean,
    default: false
  }
})

const languageStore = useLanguageStore()

const translatedText = computed(() => {
  let text = languageStore.translate(props.text)

  if (props.params) {
    Object.entries(props.params).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, value)
    })
  }
  if (props.uppercase) return text.toUpperCase()
  if (props.lowercase) return text.toLowerCase()

  return text
})
</script>

<template>
  <span>{{ translatedText }}</span>
</template>
