/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // En Palabras color scheme
        conocernos: {
          DEFAULT: '#EAC86F',
          light: '#F2D889',
          dark: '#D4B058'
        },
        emocional: {
          DEFAULT: '#F5D0D0',
          light: '#F9E3E3',
          dark: '#E8B8B8'
        },
        sensual: {
          DEFAULT: '#8D2C2C',
          light: '#A64545',
          dark: '#701F1F'
        },
        jugueton: {
          DEFAULT: '#B9A3D5',
          light: '#C8B8DF',
          dark: '#A088C7'
        }
      },
      fontFamily: {
        'wulkan': ['Wulkan Display', 'serif'],
        'interphases': ['TT Interphases Pro', 'sans-serif'],
        'interphases-mono': ['TT Interphases Pro Mono', 'monospace'],
        'serif': ['Georgia', 'serif'],
      },
      animation: {
        'card-enter': 'cardEnter 0.5s ease-out',
        'card-exit-left': 'cardExitLeft 0.3s ease-in',
        'card-exit-right': 'cardExitRight 0.3s ease-in',
      },
      keyframes: {
        cardEnter: {
          '0%': { transform: 'scale(0.9) translateY(50px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' }
        },
        cardExitLeft: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(-100vw) rotate(-20deg)', opacity: '0' }
        },
        cardExitRight: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateX(100vw) rotate(20deg)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}
