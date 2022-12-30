import type { CollectionDescription } from '../../../types'
import { makeException } from '../exceptions'
import { getTypeConstructor } from './typemapping'

const runtimeValidationError = (message: string) => makeException({
  name: 'RuntimeValidationError',
  message
})

export type ValidateFunction<T> = (what: T, required?: Array<keyof T>) => void

export const validateFromDescription = <T>(
  description: CollectionDescription,
  what: T,
  required?: Array<keyof T>
) => {
  if( !what ) {
    throw runtimeValidationError('target is empty')
  }

  const propsSet = new Set([
    ...required||[],
    ...Object.keys(what)
  ])

  propsSet.forEach((prop) => {
    const value = what[prop as keyof T]
    const property = description.properties[prop as string]
    if( !property ) {
      throw runtimeValidationError(`extraneous property: ${prop as string}`)
    }

    if( !value ) {
      throw runtimeValidationError(`missing property: ${prop as string}`)
    }

    const expectedConstructor = (value as any).constructor
    const actualConstructor = getTypeConstructor(description.properties[prop])

    if( actualConstructor !== expectedConstructor ) {
      throw runtimeValidationError(`unmatching types: ${prop as string}`)
    }

    if( expectedConstructor === Array ) {
      if( !(value as Array<any>).every((v) => v.constructor === expectedConstructor[0]) ) {
        throw runtimeValidationError(`extraneous array element: ${prop as string}`)
      }
    }
  })
}
