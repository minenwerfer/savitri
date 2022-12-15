import type { FunctionPath, DecodedToken, ApiContext, Role } from '../../types'
import baseRoles from './base-roles'

const _isGranted = (
  functionPath: FunctionPath,
  token: DecodedToken,
  context: ApiContext,
  targetRole?: Role
) => {
  const [entityName, functionName] = functionPath.split('@')

  const roleName = token?.user?.role || 'guest'
  const currentRole = targetRole || context.apiConfig?.roles?.[roleName]

  if( !currentRole ) {
    return false
  }

  const subject = currentRole?.capabilities?.[entityName]
  return (
    currentRole?.grantEverything
    || subject?.grantEverything
    || subject?.methods?.includes(functionName)
  )
}

export const isGranted = (
  functionPath: FunctionPath,
  token: DecodedToken,
  context: ApiContext
) => {
  const baseRole = token?.user?._id
    ? baseRoles.authenticated
    : baseRoles.unauthenticated

  return _isGranted(functionPath, token, context)
    || _isGranted(functionPath, token, context, baseRole)
}
