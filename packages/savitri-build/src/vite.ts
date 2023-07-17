import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueRouter from 'unplugin-vue-router/vite'
import vueComponents from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import braun from 'braun/vite'

import { scrapper } from 'braun/common'
import { readdir, readFile } from 'fs/promises'

import sassData from './sassData.js'
import { getInstanceConfig } from './instance'

import transformIndexHtml from './plugins/transform-index-html'
import loadYaml from './plugins/load-yaml'

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
        hash: true,
        libraries: [
          '@savitri/ui'
        ],
        async preEmit() {
          const paths = [
            process.cwd() + '/../api/dist/resources/collections',
            process.cwd() + '/../api/node_modules/@semantic-api/system/dist/collections',
            // process.cwd() + '/../api/node_modules/@semantic-api/api/cjs/presets',
          ]

          const scrap = scrapper({}, () => null, () => null)

          for( const path of paths ) {
            const dirs = await readdir(path)
            for( const dir of dirs ) {
              try {
                const content = await readFile(`${path}/${dir}/${dir}.description.js`)
                scrap(content.toString())
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
              'useParentStore',
              'useRouter',
              'useClipboard',
              'useAction',
              'useCondition',
              'useNavbar'
            ]
          },
          {
            '@semantic-api/common': [
              'error',
              'ok',
              'isError',
              'isOk',
              'unpack',
              'unsafe'
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
        dirs: [
          process.cwd() + '/components'
        ],
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
      transformIndexHtml(instanceConfig),
      loadYaml()
    ],
    optimizeDeps: {
      include: [
        'bson',
        '@semantic-api/types',
        '@semantic-api/common'
      ],
      exclude: [
        'vue-router'
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
    },
  }

  return config
})
