// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const lightTheme = {
  dark: false,
  colors: {
    background: '#f5f5f9',
    surface: '#FFFFFF',
    primary: '#696cff', // Sneat Purple
    secondary: '#8592a3',
    error: '#ff3e1d',
    info: '#03c3ec',
    success: '#71dd37',
    warning: '#ffab00',
  }
}

const darkTheme = {
  dark: true,
  colors: {
    background: '#232333',
    surface: '#2b2c40',
    primary: '#696cff',
    secondary: '#8592a3',
    error: '#ff3e1d',
    info: '#03c3ec',
    success: '#71dd37',
    warning: '#ffab00',
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light', // Set default to light
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
})
