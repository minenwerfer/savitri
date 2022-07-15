import type { Router } from 'vue-router'
import { Module, ActionProps } from '../module'

declare namespace global {
  var _router: Router
}


export class AccessProfileModule extends Module<{}, {}> {
  constructor() {
    super('accessProfile', {}, {})
  }

  actions(this: AccessProfileModule) {
    return {
      spawnAdd: ({ commit }: ActionProps) => {
        commit('ITEM_CLEAR')
        global._router.push({ name: 'dashboard-access-edit' })
      },

      spawnEdit: ({ commit }: ActionProps, { payload }: { payload: any }) => {
        commit('ITEM_GET', { result: payload.filters })
        global._router.push({ name: 'dashboard-access-edit' })
      }
    }
  }
}
