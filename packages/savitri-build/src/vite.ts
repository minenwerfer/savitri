import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import braun from 'braun/vite'
import ejs from 'ejs'

import sassData from './sassData.js'
import { getInstanceConfig } from './instance'

export default defineConfig({
  plugins: [
    vue(),
    braun(),
    {
      name: 'transform-index-html',
      async transformIndexHtml(html) {
        const instanceConfig = await getInstanceConfig()
        return ejs.render(html, { instanceConfig })
      }
    }
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
