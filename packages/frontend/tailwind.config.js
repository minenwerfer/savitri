const path = require('path')
const colors = require('tailwindcss/colors')

const style = {
  /** @see CMenu.vue */
  menuWidth: '15rem'
}

module.exports = {
  content: [
    '../public/**/*.html',
    '../src/**/*.vue',
    path.join(global.appDir, './src/**/*.vue')
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        'menu': `${style.menuWidth} auto`,
        'checkbox': '4em auto',
        'form': '30% auto'
      },
      width: {
        'menu': style.menuWidth,
        'view': `calc(100vw - ${style.menuWidth})`
      },
      fontSize: {
        'base': '.98rem',
        'md': '.9rem'
      },
      animation: {
        'fade': 'fade .25s forwards',
        'fadeout': 'fadeout .6s forwards',
        'slowfade': 'fade .75s forwards',
        'overlay': 'overlay .2s forwards',
        'toast': 'toast .15s forwards',
        'slip': 'slip .10s forwards',
      },
      boxShadow: {
        'foldl': '0 10px 15px -3px rgba(0, 0, 0, 0.1) 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      keyframes: {
        'fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fadeout': {
          '0%': { opacity: '1' },
          '80%': { transform: 'scale(1.2)' },
          '100%': { opacity: '0', transform: 'scale(0)' },
        },
        'overlay': {
          '0%': { opacity: '0' },
          '100%': { opacity: '.6' }
        },
        'toast': {
          '0%': { transform: 'translateY(1.5em)' },
          '100%': { transform: 'translateY(0)' }
        },
        'slip': {
          '0%': { transform: 'translateX(20%)' },
          '100%': { transform: 'translateX(0)' }
        },
      },
      colors: {
        success: colors.green,
        critical: colors.red,
        warning: colors.yellow,
        neutral: colors.blue,
      }
    },
  },
  plugins: [],
}
