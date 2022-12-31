export type CustomException = {
  name: string
  code?: string
  message?: string
  details?: Record<string, any>
}

export const makeException = (custom: CustomException) => {
  class Impl extends Error {
    name = custom.name
    code = custom.code
    details = custom.details

    constructor() {
      super(custom.message)
    }
  }

  return new Impl()
}
