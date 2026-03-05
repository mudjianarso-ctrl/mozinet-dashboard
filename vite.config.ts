import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Required for Vuetify components to show up in build
  ],
  base: '/mozinet-dashboard/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
