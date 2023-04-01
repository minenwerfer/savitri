import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import braun from 'braun/vite'
import ejs from 'ejs'

import sassData from './sassData.js'
import { getInstanceConfig } from './instance'

export default defineConfig(async () => {
  const instanceConfig = await getInstanceConfig()
  return {
    plugins: [
      vue(),
      braun({
        tag: 'sv-icon',
        ensureList: instanceConfig.icons
      }),
      {
        name: 'transform-index-html',
        transformIndexHtml(html) {
          return ejs.render(html, { instanceConfig })
        }
      }
    ],
    // optimizeDeps: {
    //   include: [
    //     'bson'
    //   ]
    // },
    build: {
      target: 'esnext',
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
  }
})
