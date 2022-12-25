import { deepMerge } from '../../../common/helpers/deepMerge'
import type { Role, Roles } from '../../types/server'

export const grantEverything = (names: Array<string>) => names.reduce((a, n) => {
  return {
    ...a,
    [n]: {
      grantEverything: true
    }
  }
}, {})

export const applyToEach = (roles: Roles, fn: (roleName: string, role: Role) => any): void => {
  Object.entries(roles).forEach(([roleName, role]) => {
    const result = fn(roleName, role)
    deepMerge(roles[roleName], result)
  }) 
}
