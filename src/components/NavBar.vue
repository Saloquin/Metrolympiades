<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bg-white shadow-md py-3 px-6 flex justify-between items-center">
    <RouterLink to="/" class="text-xl font-bold text-blue-600">Metrolympiades</RouterLink>
    <div class="flex gap-4 items-center">
      <RouterLink class="text-gray-700 hover:text-blue-600" to="/ranking">Ranking</RouterLink>
      <RouterLink class="text-gray-700 hover:text-blue-600" to="/login">Login</RouterLink>
      <RouterLink class="text-gray-700 hover:text-blue-600" to="/register">Register</RouterLink>
    </div>
  </nav>
</template>
