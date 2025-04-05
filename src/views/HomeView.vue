<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="text-center mt-16">
    <h1 class="text-4xl font-bold text-blue-700 mb-4">Welcome to Metrolympiades</h1>
    <p class="text-lg text-gray-600">Manage your team building day easily and efficiently.</p>
    <div class="mt-6 space-x-4">
      <RouterLink
        to="/register"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >Get Started</RouterLink
      >
      <RouterLink
        to="/ranking"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >View Ranking</RouterLink
      >
    </div>
  </section>
</template>
