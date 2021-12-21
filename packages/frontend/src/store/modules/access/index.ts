import { Module, ActionProps } from 'frontend/store/module'

export class AccessModule extends Module<{}, {}> {
  constructor() {
    super('access', {}, {})
  }

  actions(this: AccessModule) {
    return {
      spawnAdd: ({ commit }: ActionProps) => {
        commit('ITEM_CLEAR');
        (window as any)._router.push({ name: 'dashboard-access-edit' })
      },

      spawnEdit: ({ commit }: ActionProps, { payload }: { payload: any }) => {
        commit('ITEM_GET', { result: payload.filter });
        (window as any)._router.push({ name: 'dashboard-access-edit' })
      }
    }
  }
}
