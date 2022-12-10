type FunctionPath = `${string}@${string}`
type EntityType =
  'collection'
  | 'controllable'

export const useFunction = (functionPath: FunctionPath, entityType: EntityType = 'collection') => {
  const [entity, functionName] = functionPath.split('@')
}
