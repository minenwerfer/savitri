import type { MongoDocument, ObjectId } from '../../types'

type MapType<T> = T extends 'boolean' ? boolean
  : T extends 'checkbox' ? string
  : T extends 'datetime' ? Date|string
  : T extends 'email' ? string
  : T extends 'integer' ? number
  : T extends 'number' ? number
  : T extends 'object' ? object
  : T extends 'password' ? string
  : T extends 'radio' ? string
  : T extends 'reference' ? ObjectId|string
  : T extends 'select' ? string
  : T extends 'text' ? string
  : T extends 'textbox' ? string
  : never

type MaybeArray<T> = T extends { array: true }
  ? Array<MapType<Field<T>['type']>>
  : MapType<Field<T>['type']>

type MaybeReadonly<T> = T extends { readOnly: true }
  ? Readonly<MaybeArray<T>>
  : MaybeArray<T>

type Type<T> = MaybeReadonly<T>

type Field<F> = F & {
  type: string
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

export type Schema<
  S extends { fields: Record<string, Field<any>> },
  F=S['fields'],
> = S extends { strict: true }
  ? StrictMode<F>
  : PermissiveMode<F>
