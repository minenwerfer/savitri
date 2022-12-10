export type CustomException = {
  name: string
  message: string
}

export const makeException = (custom: CustomException) => {
  class Impl extends Error {
    name = custom.name
    constructor() {
      super(custom.message)
    }
  }

  return new Impl()
}
