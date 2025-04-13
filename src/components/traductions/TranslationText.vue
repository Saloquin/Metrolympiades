<script setup>
import { useLanguageStore } from '@/stores/language'
import { computed } from 'vue'

const props = defineProps({
  // Clé de traduction
  text: {
    type: String,
    required: true
  },
  // Paramètres optionnels pour le remplacement dynamique
  params: {
    type: Object,
    default: () => ({})
  },
  // Option pour transformer le texte en majuscules
  uppercase: {
    type: Boolean,
    default: false
  },
  // Option pour transformer le texte en minuscules
  lowercase: {
    type: Boolean,
    default: false
  }
})

const languageStore = useLanguageStore()

const translatedText = computed(() => {
  let text = languageStore.translate(props.text)

  // Remplacer les paramètres dynamiques
  if (props.params) {
    Object.entries(props.params).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, value)
    })
  }

  // Appliquer les transformations
  if (props.uppercase) return text.toUpperCase()
  if (props.lowercase) return text.toLowerCase()

  return text
})
</script>

<template>
  <span>{{ translatedText }}</span>
</template>
