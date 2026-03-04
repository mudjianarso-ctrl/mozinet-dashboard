<template>
  <v-app>
    <MainLayout>
      <Dashboard />
    </MainLayout>
  </v-app>
</template>

<script setup lang="ts">
import MainLayout from './layouts/MainLayout.vue'
import Dashboard from './views/Dashboard.vue'
</script>
