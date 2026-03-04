<template>
  <v-card 
    class="h-100 glass-card transition-swing" 
    elevation="0" 
    rounded="xl"
    :style="cardStyle"
  >
    <!-- Background Pattern/Image Layer -->
    <div class="card-bg-layer" :style="{ backgroundImage: `url(${patternImage})` }"></div>
    <div class="card-gradient-overlay" :style="{ background: gradient }"></div>

    <v-card-text class="position-relative z-index-1 text-white">
      <div class="d-flex justify-space-between align-start">
        <v-avatar color="white" variant="tonal" rounded="lg" size="42" class="glass-avatar">
          <v-icon :icon="icon" size="24" />
        </v-avatar>
        
        <v-menu location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" color="white" />
          </template>
          <v-list density="compact" class="glass-menu" rounded="lg">
            <v-list-item v-for="opt in filterOptions" :key="opt.val" @click="$emit('filter', opt.val)">
              <v-list-item-title class="text-caption font-weight-bold">{{ opt.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <div class="mt-4">
        <p class="text-overline text-white opacity-70 mb-0 font-weight-bold" style="line-height: 1.2">{{ title }}</p>
        <h4 class="text-h5 font-weight-black text-white mb-2 shadow-text">{{ value }}</h4>
        <div class="d-flex align-center">
          <v-chip size="x-small" :color="trend > 0 ? 'success' : 'error'" class="font-weight-black px-2" variant="flat">
            {{ trend > 0 ? '+' : '' }}{{ trend }}%
          </v-chip>
          <span class="text-caption text-white opacity-60 ms-2 font-weight-medium">vs last month</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: string;
  icon: string;
  trend: number;
  gradient: string;
  patternImage?: string;
}>();

defineEmits(['filter']);

const cardStyle = computed(() => ({
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const filterOptions = [
  { label: 'Last 7 Days', val: 7 },
  { label: 'Last 30 Days', val: 30 },
  { label: 'All Time', val: 'all' }
];
</script>

<style scoped>
.glass-card {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.glass-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5) !important;
}
.card-bg-layer {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  filter: grayscale(100%) brightness(200%);
  z-index: 0;
}
.card-gradient-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.85;
  z-index: 0;
}
.glass-avatar {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.shadow-text {
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.z-index-1 { z-index: 1; }
.glass-menu {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
