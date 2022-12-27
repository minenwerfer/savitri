export type CustomException = {
  name: string
  code?: string
  message?: string
}

export const makeException = (custom: CustomException) => {
  class Impl extends Error {
    name = custom.name
    code = custom.code

    constructor() {
      super(custom.message)
    }
  }

  return new Impl()
}
