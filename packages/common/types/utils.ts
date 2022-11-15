export type ValuesOf<T> = T extends readonly string[]
  ? T[number]
  : T[keyof T]

export type DeepWritable<T> = {
  -readonly [P in keyof T]: DeepWritable<T[P]>
}

