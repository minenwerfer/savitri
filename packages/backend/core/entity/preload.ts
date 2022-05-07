import merge from 'lodash/merge'
import { commonControllers } from '../controller'

export const applyPreset = (description: any, name: string, parent?: string) => {
  const preset = require(__dirname + `/../../presets/${name}`)
  const presetObject = Object.assign({}, parent ? (preset[parent]||{}) : preset)

  return merge(description, presetObject)
}

export const requireEntity = (entityName:string): any => {
  return commonControllers.includes(entityName)
    ? require(`${__dirname}/../../entities/${entityName}/index.json`)
    : require(`${process.cwd()}/entities/${entityName}/index.json`)
}

export const preloadEntity = (entity: any) => {
  if( entity.alias ) {
    const _aliasedEntity = requireEntity(entity.alias)

    const {
      module,
      route,
      strict,
      ...aliasedEntity

    } = _aliasedEntity

    const temp = Object.assign(aliasedEntity, entity)
    Object.assign(entity, temp)
  }

  entity.presets?.forEach((presetName: string) => {
    applyPreset(entity, presetName)
  })
  
  return entity
}
