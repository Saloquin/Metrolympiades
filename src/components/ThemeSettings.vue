<script setup>
import { ref,computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useLanguageStore } from '@/stores/language'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPalette, faTextHeight, faRotateLeft } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  showColorSettings: {
    type: Boolean,
    default: false
  }
})

const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const showSettings = ref(false)

const fontSizes = computed(() => [
  { label: languageStore.translate('small'), value: 'small' },
  { label: languageStore.translate('medium'), value: 'medium' },
  { label: languageStore.translate('large'), value: 'large' }
])

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
        <h3 class="text-lg font-semibold">
          <TranslationText text="settings" />
        </h3>
        <button
          @click="resetSettings"
          class="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
          :title="
            showColorSettings
              ? languageStore.translate('resetAll')
              : languageStore.translate('resetFontSize')
          "
        >
          <FontAwesomeIcon :icon="faRotateLeft" />
        </button>
      </div>
      <template v-if="showColorSettings">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">
            <TranslationText text="primaryColor" />
          </label>
          <input
            type="color"
            :value="themeStore.primaryColor"
            @input="(e) => themeStore.setPrimaryColor(e.target.value)"
            class="w-full h-10 rounded cursor-pointer"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">
            <TranslationText text="secondaryColor" />
          </label>
          <input
            type="color"
            :value="themeStore.secondaryColor"
            @input="(e) => themeStore.setSecondaryColor(e.target.value)"
            class="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </template>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">
          <FontAwesomeIcon :icon="faTextHeight" class="mr-2" />
          <TranslationText text="fontSize" />
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
