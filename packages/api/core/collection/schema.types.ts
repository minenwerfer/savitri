import type { CollectionProperty, ValuesOf } from '../../../common/types'
export type { CollectionDescription } from '../../../common/types'
import type { MongoDocument, ObjectId } from '../../types'
import type { TypeMapping } from './typemapping'

export type Schema<T extends Properties> = CaseOwned<T>

export type SchemaProperties<T> = T & {
  [
    P in keyof T as
    P extends keyof Properties
      ? P
      : never
  ]: P extends 'properties'
    ? Writable<T[P]>
    : T[P]
}

type Properties = {
  $id: string
  required?: ReadonlyArray<string>
  presets?: ReadonlyArray<string>
  properties: Record<string, Property<any>>
}

type Reference = ObjectId|string|(object & MongoDocument)|undefined
type Owned = {
  owner: Reference
}

type MapType<T extends keyof TypeMapping> = TypeMapping[T]

type CaseReference<T> = T extends { $id: string }
  ? Reference
  : T extends { values: [{ __query: { $id: string } }] } | { values: { __query: { $id: string } } }
  ? Reference
  : MapType<Property<T>['type']>

type CaseArray<T> = T extends { array: true }
  ? Array<CaseReference<T>>
  : CaseReference<T>

type CaseReadonly<T> = T extends { readOnly: true }
  ? Readonly<CaseArray<T>>
  : CaseArray<T>

type Type<T> = CaseReadonly<T>

type Property<F> = F & {
  type: keyof TypeMapping
  array?: boolean
  readOnly?: boolean
}

type IsRequired<
  F,
  ExplicitlyRequired,
  Value extends boolean
> = keyof {
  [
    P in keyof F as
    F[P] extends { required: Value } | { readOnly: true }
      ? P
      : P extends ValuesOf<ExplicitlyRequired>
      ? P
      : never
  ]: F[P]
}

type RequiredProperties<F, E> = IsRequired<F, E, true>
type UnrequiredProperties<F> = IsRequired<F, '', false>

type OptionalProperties<F, E> = Exclude<keyof F, RequiredProperties<F, E>>

type StrictMode<F> = MongoDocument &
  { [P in keyof F]: Type<F[P]> } &
  { [P in UnrequiredProperties<F>]?: Type<F[P]> }

type PermissiveMode<F, E> = MongoDocument &
  { [P in RequiredProperties<F, E>]: Type<F[P]> } &
  { [P in OptionalProperties<F, E>]?: Type<F[P]> }

type CaseOwned<T extends Properties> = T extends { owned: true }
  ? Owned & MapTypes<T>
  : MapTypes<T>

type MapTypes<
  S extends Properties,
  F=S['properties'],
  ExplicitlyRequired=S['required']
> = S extends { strict: true }
  ? StrictMode<F>
  : PermissiveMode<F, ExplicitlyRequired>


type F<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer K>
    ? T[P] & ReadonlyArray<K>
    : P extends keyof CollectionProperty
    ? CollectionProperty[P]
    : never
}
type Writable<T> = {
  -readonly [P in keyof T]: F<T[P]>
}
