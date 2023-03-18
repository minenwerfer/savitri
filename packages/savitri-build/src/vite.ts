import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { nodeResolve } from '@rollup/plugin-node-resolve'
import sassData from './sassData.js'

export default defineConfig({
  plugins: [
    vue()
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
