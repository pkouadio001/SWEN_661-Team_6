/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color
        primary: {
          50: '#E6F2FF',
          100: '#CCE5FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
        },
        // Page-specific theme colors
        medications: {
          50: '#E6F7EF',
          100: '#CCF0DF',
          500: '#00A86B',
          600: '#008656',
          700: '#006442',
        },
        appointments: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        healthlog: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        messages: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
        },
        emergency: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#991B1B',
        },
        // Status colors
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
        info: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}