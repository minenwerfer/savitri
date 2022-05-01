import { Module, } from '../module'

export class ReleaseModule extends Module<{}, {}> {
  constructor() {
    super('release', {}, {})
  }

  mutations() {
    return {
      ITEMS_GET: (state: any, { result }: { result: any }) => {
        Object.assign(state.item, result)
      }
    }
  }
}
