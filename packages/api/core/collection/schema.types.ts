import type { MongoDocument, ObjectId } from '../../types'

type _Type<T> = T extends 'boolean' ? boolean
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

type Type<T> = T extends { array: true }
  ? Array<_Type<Field<T>['type']>>
  : _Type<Field<T>['type']>

type Field<F> = F & {
  type: string
  array?: boolean
}

type IsRequired<F, Value extends boolean> = keyof {
  [P in keyof F as F[P] extends { required: Value } ? P : never]: F[P]
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
