/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        solar: {
          purple: '#9662AD',
          deep: '#765087',
          lavender: '#F0E6F5',
          lightLavender: '#F8F4FA',
          bg: '#FFFFFF',
          lightGrey: '#F3F3F5',
          border: '#E7E5E9',
          borderSubtle: '#F0EEF2',
          text: '#17151A',
          secondary: '#77727D',
          muted: '#9E9AA3',
          darkHover: '#684577',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        script: ['"Alex Brush"', '"Caveat"', 'cursive'],
        body: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 21, 26, 0.04), 0 1px 2px -1px rgba(23, 21, 26, 0.03)',
        'card': '0 2px 8px -2px rgba(118, 80, 135, 0.06), 0 1px 4px -1px rgba(23, 21, 26, 0.04)',
        'card-hover': '0 12px 24px -6px rgba(118, 80, 135, 0.12), 0 4px 8px -2px rgba(23, 21, 26, 0.06)',
        'dropdown': '0 10px 25px -5px rgba(118, 80, 135, 0.15), 0 8px 10px -6px rgba(23, 21, 26, 0.08)',
        'modal': '0 20px 40px -15px rgba(118, 80, 135, 0.25), 0 10px 20px -8px rgba(23, 21, 26, 0.1)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
