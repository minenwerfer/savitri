import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueRouter from 'unplugin-vue-router/vite'
import vueComponents from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import braun from 'braun/vite'
import ejs from 'ejs'

import { scrapper } from 'braun/common'
import { readdir, readFile } from 'fs/promises'

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
        libraries: [
          '@savitri/ui'
        ],
        async preEmit() {
          const paths = [
            process.cwd() + '/../api/resources/collections',
            process.cwd() + '/../api/node_modules/@semantic-api/system/cjs/resources/collections',
            // process.cwd() + '/../api/node_modules/@semantic-api/api/cjs/presets',
          ]

          const scrap = scrapper({}, () => null, () => null)

          for( const path of paths ) {
            const dirs = await readdir(path)
            for( const dir of dirs ) {
              try {
                const content = await readFile(`${path}/${dir}/${dir}.description.ts`)
                scrap(content)
              } catch( e ) {
              }
            }
          }
        }
      }),
      autoImport({
        exclude: [
          /\/node_modules\//,
          /\.git\//,
          /\/@?savitri\//,
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
      target: 'esnext'
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
