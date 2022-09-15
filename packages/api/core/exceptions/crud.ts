export class ItemNotFound extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ItemNotFound'
  }
}
