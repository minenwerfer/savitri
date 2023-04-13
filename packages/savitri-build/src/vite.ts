import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import braun from 'braun/vite'
import ejs from 'ejs'

import sassData from './sassData.js'
import { getInstanceConfig } from './instance'

export default defineConfig(async () => {
  const instanceConfig = await getInstanceConfig()
  const config: ReturnType<typeof defineConfig> = {
    resolve: {
      alias: {
        'bson': require.resolve('bson')
      }
    },
    plugins: [
      braun({
        tag: 'sv-icon',
        ensureList: instanceConfig.icons,
        libraries: [
          '@savitri/ui'
        ]
      }),
      vue(),
      {
        name: 'transform-index-html',
        transformIndexHtml(html) {
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
      target: 'esnext',
      rollupOptions: {
        preserveSymlinks: true
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: sassData({})
        }
      }
    }
  }

  return config
})
