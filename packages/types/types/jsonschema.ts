export type JsonSchema = {
  $id: string
  required?: ReadonlyArray<string>
  presets?: ReadonlyArray<string>
  properties: Record<string, Property<any>>
}

type Property<F> = F & {
  // type?: keyof TypeMapping
  array?: boolean
  readOnly?: boolean
}

