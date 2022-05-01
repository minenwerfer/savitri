import { Module } from '../module'

/**
 * @exports @const
 * Automatically registers modules.
 */
export const autoModules = (store: any) => {
  store.subscribe(async (mutation: { type: string, payload: any }, state: any) => {

    const { type, payload } = mutation
    if( type === 'meta/DESCRIPTIONS_ADD' ) {

      if( store.hasModule(payload.module) ) {
        store.commit(`${payload.module}/DESCRIPTION_SET`, payload, { root: true })
        return
      }

      const Impl = class extends Module<{}, {}> {
        constructor(route: string, meta: any, item: any) {
          super(route, meta, item, payload)
        }
      }

      store.registerModule(payload.module, (new Impl(payload.module, {}, {}) as Module<{}, {}>).module)
      store.commit(`${payload.module}/DESCRIPTION_SET`, payload, { root: true })
    }
  })
}
