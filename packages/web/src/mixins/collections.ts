import { useStore } from '../state/use'

type CollectionClient = {
  store: ReturnType<typeof useStore>
}

export const collections = new Proxy({} as CollectionClient, {
  get: (_, key: string) => {
    return {
      store: useStore(key),
    }
  }
})
