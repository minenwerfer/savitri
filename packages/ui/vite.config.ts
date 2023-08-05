import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import typescript2 from 'rollup-plugin-typescript2'
import dts from 'vite-plugin-dts'

import { viteStaticCopy } from 'vite-plugin-static-copy'
import { sassData } from 'savitri-build'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    }),
    typescript2({
      check: false,
      exclude: [
        'vite.config.ts'
      ]
    }),
    viteStaticCopy({
      targets: [
        {
          src: './src/scss',
          dest: '.'
        }
      ]
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'savitri-ui',
      formats: [
        'es'
      ]
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.ts')
      },
      output: {
        exports: 'named'
      },
      external: [
        'vue',
        'vue-router',
        /@savitri\/web/
      ]
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: sassData({
          scssRoot: './src/scss'
        })
      }
    }
  },
})
