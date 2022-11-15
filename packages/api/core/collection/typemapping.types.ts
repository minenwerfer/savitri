import type { ValuesOf } from '../../../common/types'

export type MakeMapping<
  T extends Record<string, readonly string[]>,
  Arrayed extends readonly string[]
> = Flatten<DeepMapping<T>, Arrayed>

type DeepMapping<T extends Record<string, readonly string[]>> = {
  [P in keyof T]: {
    [K in ValuesOf<T[P]>]: P extends 'String'
      ? string : P extends 'Number'
      ? number : P extends 'Object'
      ? object : P extends 'Boolean'
      ? boolean : P extends 'Date'
      ? Date : never
  }
}

type Flatten<T, Arrayed> = Extract<ValuesOf<{
  [P in keyof T]: {
    [K in keyof T[P]]: K extends ValuesOf<Arrayed>
      ? [T[P][K]]
      : T[P][K]
  }
}>, object>
