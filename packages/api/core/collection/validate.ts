import type { CollectionDescription } from '../../../types'
import { makeException } from '../exceptions'
import { getTypeConstructor } from './typemapping'

const runtimeValidationError = (message: string, details?: Record<string, any>) => makeException({
  name: 'RuntimeValidationError',
  message,
  details
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

  const propsSet = required
    ? new Set([ ...required, ...Object.keys(what) ])
    : new Set(Object.keys(description.properties))

  const getType = (value: any) => {
    return Array.isArray(value)
      ? 'array'
      : typeof value
  }

  const errors: Record<string, {
    type: 'extraneous'
      | 'missing'
      | 'unmatching'
      | 'extraneous_element'
    details: {
      expected: string
      got: string
    }
  }> = {}

  propsSet.forEach((_prop) => {
    const prop = _prop as string
    const value = what[prop as keyof T]
    const property = description.properties[prop]

    if( !property ) {
      errors[prop] = {
        type: 'extraneous',
        details: {
          expected: 'undefined',
          got: getType(value)
        }
      }

      return
    }

    if( !value ) {
      if(
        (!required && description.required?.includes(prop))
        || (required && required.includes(prop as keyof T))
      ) {
        errors[prop] = {
          type: 'missing',
          details: {
            expected: property.type as string,
            got: 'undefined'
          }
        }
      }

      return
    }

    const expectedConstructor = getTypeConstructor(description.properties[prop])
    const actualConstructor = (value as any).constructor

    if(
      actualConstructor !== expectedConstructor
      && !(Array.isArray(expectedConstructor) && actualConstructor === Array)
    ) {
      errors[prop] = {
        type: 'unmatching',
        details: {
          expected: property.type as string,
          got: getType(value)
        }
      }
    }

    if( Array.isArray(expectedConstructor) ) {
      const extraneous = (value as Array<any>).find((v) => v.constructor !== expectedConstructor[0])
      if( extraneous ) {
        errors[prop] = {
          type: 'extraneous_element',
          details: {
            expected: getType(expectedConstructor[0]()),
            got: getType(extraneous)
          }
        }
      }
    }
  })

  if( Object.keys(errors).length > 0 ) {
    throw runtimeValidationError('some properties failed to validate', errors)
  }
}
