import { readdirSync, existsSync } from 'fs'
import type { CollectionDescription } from '../../../common/types'
import { preloadCollection } from '../../../api/core/collection'

const __cachedDescriptions: Record<string, CollectionDescription> = {}

export const getDescriptions = (): Record<string, CollectionDescription> => {
  if( Object.keys(__cachedDescriptions).length > 0 ) {
    return __cachedDescriptions
  }

  const modulePaths = [
    `${__dirname}/../../../collections`,
    `${process.cwd()}/collections`,
    ...global.modules
      ? global.modules.map(({ name: moduleName }: { name: string }) => `${process.cwd()}/../../../node_modules/${moduleName}/collections`)
      : []
  ]

  const descriptions = modulePaths
    .reduce((a: Record<string, any>, dir: string) => ({
      ...a,
      ...readdirSync(dir)
        .reduce((a: any, d: string) => {
          if( d.startsWith('_') || !existsSync(`${dir}/${d}/index.json`) ) {
            return a
          }

          return {
            ...a,
            [d]: preloadCollection(require(`${dir}/${d}/index.json`))
          }
        }, {})
  }), {})

  Object.assign(__cachedDescriptions, descriptions)
  return descriptions
}

