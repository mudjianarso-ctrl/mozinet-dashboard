<template>
  <v-layout class="main-layout-root">
    <v-navigation-drawer 
      v-model="drawer" 
      :rail="rail" 
      permanent 
      @click="rail = false" 
      elevation="0" 
      class="glass-drawer"
    >
      <v-list class="pa-4">
        <v-list-item 
          prepend-avatar="https://randomuser.me/api/portraits/lego/1.jpg" 
          title="MOZINET" 
          subtitle="Enterprise Intel"
          class="mb-2"
        >
          <template v-slot:append>
            <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-divider class="opacity-10"></v-divider>

      <v-list density="compact" nav class="pa-4">
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" active color="primary" rounded="lg" />
        <v-list-item prepend-icon="mdi-chart-line" title="Analytics" value="analytics" rounded="lg" />
        <v-list-item prepend-icon="mdi-account-group" title="Staff" value="staff" rounded="lg" />
        <v-list-subheader class="text-overline mt-4 opacity-50">Operations</v-list-subheader>
        <v-list-item prepend-icon="mdi-file-document" title="Transactions" value="tx" rounded="lg" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" value="settings" rounded="lg" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar elevation="0" color="transparent" class="px-4 glass-app-bar" border="b">
      <v-app-bar-nav-icon @click="drawer = !drawer" :color="isDark ? 'white' : 'primary'"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      
      <v-btn icon @click="toggleTheme" class="me-2" :color="isDark ? 'white' : 'primary'">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
      
      <v-avatar color="primary" size="38" class="elevation-4">
        <span class="text-caption text-white font-weight-black">MZ</span>
      </v-avatar>
    </v-app-bar>

    <v-main :class="['dashboard-main', isDark ? 'dark-bg' : 'light-bg']">
      <div class="content-overlay">
        <slot></slot>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const drawer = ref(true)
const rail = ref(false)

const isDark = computed(() => theme.global.name.value === 'dark')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>

<style scoped>
.main-layout-root {
  transition: background 0.3s ease;
}
.dashboard-main {
  min-height: 100vh;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* HIGH-END GRADIENT BACKGROUNDS */
.light-bg {
  background: #f5f5f9;
  background-image: radial-gradient(at 0% 0%, rgba(105, 108, 255, 0.05) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, rgba(113, 221, 55, 0.05) 0px, transparent 50%);
}

.dark-bg {
  background: #0f172a;
  background-image: radial-gradient(at 0% 0%, rgba(105, 108, 255, 0.15) 0px, transparent 50%),
                    radial-gradient(at 100% 0%, rgba(113, 221, 55, 0.1) 0px, transparent 50%);
}

.glass-drawer {
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.light-bg .glass-drawer { background: rgba(255, 255, 255, 0.8) !important; }
.dark-bg .glass-drawer { background: rgba(15, 23, 42, 0.8) !important; }

.glass-app-bar {
  backdrop-filter: blur(10px);
  border-color: rgba(255, 255, 255, 0.05) !important;
}

.content-overlay {
  position: relative;
  z-index: 1;
}
</style>
