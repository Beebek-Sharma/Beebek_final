/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        github: {
          // GitHub Light Mode Colors
          light: '#ffffff',           // Page background
          lightSecondary: '#f6f8fa', // Header/Footer
          lightAccent: '#eaecef',     // Card/Container backgrounds
          lightBorder: '#d0d7de',     // Border color
          lightText: '#24292f',       // Main text color
          lightTextSecondary: '#57606a', // Secondary text color
          lightButton: '#2ea44f',     // Green button
          lightLink: '#60a7f8ff',       // Link color
          // GitHub Dark Mode Colors
          dark: '#0d1117',            // Page background
          darkSecondary: '#161b22',   // Header/Footer
          darkAccent: '#21262d',      // Card/Container backgrounds
          darkBorder: '#30363d',      // Border color
          darkText: '#c9d1d9',        // Main text color
          darkTextSecondary: '#8b949e', // Secondary text color
          darkButton: '#238636',      // Green button
          darkLink: '#58a6ff',        // Link color
        },
          replitBg: '#181A20',
          replitPanel: '#23242B',
          replitBorder: '#23242B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
