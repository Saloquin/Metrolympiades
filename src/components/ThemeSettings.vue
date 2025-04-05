<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPalette, faTextHeight, faRotateLeft } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  showColorSettings: {
    type: Boolean,
    default: false
  }
})

const themeStore = useThemeStore()
const showSettings = ref(false)

const fontSizes = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' }
]

const resetSettings = () => {
  if (props.showColorSettings) {
    themeStore.resetAll()
  } else {
    themeStore.resetFontSizeOnly()
  }
}
</script>

<template>
  <div class="fixed bottom-4 right-4">
    <button
      @click="showSettings = !showSettings"
      class="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700"
    >
      <FontAwesomeIcon :icon="showColorSettings ? faPalette : faTextHeight" />
    </button>

    <div
      v-if="showSettings"
      class="absolute bottom-16 right-0 bg-white p-4 rounded-lg shadow-xl w-64"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Paramètres</h3>
        <button
          @click="resetSettings"
          class="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
          :title="showColorSettings ? 'Réinitialiser tout' : 'Réinitialiser la taille du texte'"
        >
          <FontAwesomeIcon :icon="faRotateLeft" />
        </button>
      </div>

      <!-- Color settings only shown when logged in -->
      <template v-if="showColorSettings">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Couleur principale</label>
          <input
            type="color"
            :value="themeStore.primaryColor"
            @input="(e) => themeStore.setPrimaryColor(e.target.value)"
            class="w-full h-10 rounded cursor-pointer"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Couleur secondaire</label>
          <input
            type="color"
            :value="themeStore.secondaryColor"
            @input="(e) => themeStore.setSecondaryColor(e.target.value)"
            class="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </template>

      <!-- Font size settings always visible -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">
          <FontAwesomeIcon :icon="faTextHeight" class="mr-2" />
          Taille du texte
        </label>
        <select
          :value="themeStore.fontSize"
          @change="(e) => themeStore.setFontSize(e.target.value)"
          class="w-full p-2 border rounded"
        >
          <option v-for="size in fontSizes" :key="size.value" :value="size.value">
            {{ size.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>