import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import braun from 'braun/vite'
import sassData from './sassData.js'

export default defineConfig({
  plugins: [
    vue(),
    braun()
  ],
  optimizeDeps: {
    include: [
      'bson'
    ]
  },
  build: {
    target: 'esnext'
  },
  // build: {
  //   rollupOptions: {
  //     external: [
  //       'bson'
  //     ],
  //     plugins: [
  //       nodeResolve()
  //     ]
  //   }
  // },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: sassData({})
      }
    }
  }
})
