/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        institutional: '#1E3A5F',
        status: {
          fact: '#3B82F6',
          calculation: '#10B981',
          model: '#8B5CF6',
          scenario: '#F59E0B',
          synthetic: '#6B7280',
        },
        background: '#06090E',
        surface: {
          DEFAULT: '#0B1019',
          base: '#0B1019',
          raised: '#111827',
          overlay: '#1A2333',
          border: 'rgba(255, 255, 255, 0.07)',
        },
        'surface-elevated': '#111827',
        'surface-border': 'rgba(255, 255, 255, 0.07)',
        charcoal: {
          950: '#06090E',
          900: '#0B1019',
          800: '#111827',
          700: '#1A2333',
          600: '#263347',
          500: '#384963',
        },
        carbon: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          accent: '#00F2FE',
        },
        slate: {
          850: '#131C2E',
          900: '#0B1019',
          950: '#06090E',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s infinite ease-in-out',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.2), inset 0 0 15px rgba(16, 185, 129, 0.05)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(16, 185, 129, 0.1)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
