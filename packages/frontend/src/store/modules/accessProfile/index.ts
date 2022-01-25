import { Module, ActionProps } from 'frontend/store/module'

export class AccessProfileModule extends Module<{}, {}> {
  constructor() {
    super('accessProfile', {}, {})
  }

  actions(this: AccessProfileModule) {
    return {
      spawnAdd: ({ commit }: ActionProps) => {
        commit('ITEM_CLEAR');
        (window as any)._router.push({ name: 'dashboard-access-edit' })
      },

      spawnEdit: ({ commit }: ActionProps, { payload }: { payload: any }) => {
        commit('ITEM_GET', { result: payload.filters });
        (window as any)._router.push({ name: 'dashboard-access-edit' })
      }
    }
  }
}
