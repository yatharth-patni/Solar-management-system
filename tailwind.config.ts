import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        solar: {
          purple: '#80538F',          // Primary Purple
          deep: '#693F77',            // Deep Purple
          secondaryPurple: '#A986B8', // Secondary Purple
          lavender: '#F1EAF5',        // Light Purple
          lightLavender: '#F9F6FA',
          bg: '#F7F6F8',              // Background
          white: '#FFFFFF',
          lightGrey: '#F2F0F4',
          border: '#E8E5EA',          // Border
          borderSubtle: '#F0EEF2',
          text: '#211D24',            // Primary Text
          secondary: '#6F6874',       // Secondary Text
          muted: '#8C8592',
          darkHover: '#623B70',
        }
      },
      fontFamily: {
        sans: ["'Google Sans Flex'", "'Google Sans'", 'sans-serif'],
        display: ["'Google Sans Flex'", "'Google Sans'", 'sans-serif'],
        body: ["'Google Sans Flex'", "'Google Sans'", 'sans-serif'],
        script: ['"Caveat"', '"Alex Brush"', 'cursive'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(33, 29, 36, 0.04), 0 1px 2px -1px rgba(33, 29, 36, 0.03)',
        'card': '0 2px 8px -2px rgba(128, 83, 143, 0.06), 0 1px 4px -1px rgba(33, 29, 36, 0.04)',
        'card-hover': '0 12px 24px -6px rgba(128, 83, 143, 0.12), 0 4px 8px -2px rgba(33, 29, 36, 0.06)',
        'dropdown': '0 10px 25px -5px rgba(128, 83, 143, 0.15), 0 8px 10px -6px rgba(33, 29, 36, 0.08)',
        'modal': '0 20px 40px -15px rgba(128, 83, 143, 0.25), 0 10px 20px -8px rgba(33, 29, 36, 0.1)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
};

export default config;
