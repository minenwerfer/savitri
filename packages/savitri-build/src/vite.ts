import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueRouter from 'unplugin-vue-router/vite'
import vueComponents from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
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
        ensureList: [
          ...instanceConfig.icons,
        ],
        libraries: [
          '@savitri/ui'
        ]
      }),
      autoImport({
        include: [
          /\.vue$/,
          /\.vue?vue/
        ],
        imports: [
          'vue',
          {
            '@savitri/web': [
              'useHttp',
              'useStore',
              'useRouter',
              'useClipboard',
              'useAction',
              'useCondition'
            ]
          }
        ]
      }),
      vueRouter({
        routesFolder: process.cwd() + '/pages',
        exclude: [
          '**/_*'
        ],
        dts: false
      }),
      vueComponents({
        resolvers: [
          (componentName) => {
            if( componentName.startsWith('Sv') ) {
              return {
                name: componentName,
                from: '@savitri/ui'
              }
            }
          }
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
