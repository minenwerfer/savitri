export const typeMapping: Array<[Array<string>, any]> = [
  [
    [
      'text',
      'password',
      'radio',
      'select'
    ],
    String
  ],
  [
    [
      'number',
      'integer'
    ],
    Number
  ],
  [ ['checkbox'], [String] ],
  [ ['object'], Object ],
  [ ['boolean'], Boolean ],
  [ ['datetime'], Date ]
]

