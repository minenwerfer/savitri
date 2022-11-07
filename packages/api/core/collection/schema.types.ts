import type { CollectionField } from '../../../common/types'
export type { CollectionDescription } from '../../../common/types'
import type { MongoDocument, ObjectId } from '../../types'
import type { TypeMapping } from './typemapping'

export type Schema<T extends Fields> = CaseOwned<T>

export type SchemaFields<T> = {
  [
    P in keyof T as
    P extends 'strict' | 'fields'
      ? P
      : never
  ]: P extends 'fields'
    ? Writable<T[P]>
    : T[P]
}

type Fields = {
  presets?: ReadonlyArray<string>
  fields: Record<string, Field<any>>
}

type Reference = ObjectId|string|(object & MongoDocument)|undefined
type Owned = {
  owner: Reference
}

type MapType<T extends keyof TypeMapping> = TypeMapping[T]

type CaseReference<T> = T extends { collection: string }
  ? Reference
  : T extends { values: [{ __query: { collection: string } }] }
  ? Reference
  : T extends { values: { __query: { collection: string } } }
  ? Reference
  : MapType<Field<T>['type']>

type CaseArray<T> = T extends { array: true }
  ? Array<CaseReference<T>>
  : CaseReference<T>

type CaseReadonly<T> = T extends { readOnly: true }
  ? Readonly<CaseArray<T>>
  : CaseArray<T>

type Type<T> = CaseReadonly<T>

type Field<F> = F & {
  type: keyof TypeMapping
  array?: boolean
  readOnly?: boolean
}

type IsRequired<F, Value extends boolean> = keyof {
  [
    P in keyof F as
    F[P] extends { required: Value }
      ? P
      : F[P] extends { readOnly: true }
      ? P
      : never
  ]: F[P]
}

type RequiredFields<F> = IsRequired<F, true>
type UnrequiredFields<F> = IsRequired<F, false>

type OptionalFields<F> = Exclude<keyof F, RequiredFields<F>>

type StrictMode<F> = MongoDocument &
  { [P in keyof F]: Type<F[P]> } &
  { [P in UnrequiredFields<F>]?: Type<F[P]> }

type PermissiveMode<F> = MongoDocument &
  { [P in RequiredFields<F>]: Type<F[P]> } &
  { [P in OptionalFields<F>]?: Type<F[P]> }

type CaseOwned<T extends Fields> = T extends { owned: true }
  ? Owned & MapTypes<T>
  : MapTypes<T>

type MapTypes<
  S extends Fields,
  F=S['fields'],
> = S extends { strict: true }
  ? StrictMode<F>
  : PermissiveMode<F>


type F<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer K>
    ? T[P] & Array<K>
    : P extends keyof CollectionField
    ? CollectionField[P]
    : P
}
type Writable<T> = {
  -readonly [P in keyof T]: F<T[P]>
}

