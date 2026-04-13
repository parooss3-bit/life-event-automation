import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D7A6B',
        secondary: '#F5A623',
      },
    },
  },
  plugins: [],
} satisfies Config
