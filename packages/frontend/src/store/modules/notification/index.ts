import { Module, ActionProps, CommonState, MutationProps } from 'frontend/store/module'

export const initialState = {
  messages: {
    local: [],
    domain: []
  }
}

export class NotificationModule extends Module<{}, {}> {
  constructor() {
    super('notification', initialState, {})
  }

  getters() {
    return {
      unread: (state: any) => {
        return [
          ...state.messages.local,
          ...state.messages.domain,
        ]
      },

      localLast: (state: any) => {
        return 19
      },

      domainLast: (state: any) => {
        return 20
      }
    }
  }

  actions(this: NotificationModule) {
    return {
      ping: (...args:any) => {
        const func = this._actionHelper('ping', 'NOTIFICATION_PING')
        const [{ getters: { localLast, domainLast } }]: [ ActionProps, unknown ] = args

        return func(args[0], {
          payload: {
            localLast,
            domainLast
          }
        })
      },

      notify: this._actionHelper('notify'),
    }
  }

  mutations(this: NotificationModule) {
    return {
      NOTIFICATION_PING: (state: CommonState & { messages: { local: [], domain: []} }, { result }: MutationProps) => {
        state.messages.local = result.local
        state.messages.domain = result.domain
      }
    }
  }
}
