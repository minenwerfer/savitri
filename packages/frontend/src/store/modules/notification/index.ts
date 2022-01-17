import { Module, CommonState, MutationProps } from 'frontend/store/module'

export const initialState = {
  messages: []
}

export class NotificationModule extends Module<{}, {}> {
  constructor() {
    super('notification', initialState, {})
  }

  getters() {
    return {
      unread: (state: any) => {
        return state.messages
      }
    }
  }

  actions(this: NotificationModule) {
    return {
      ping: this._actionHelper('ping', 'NOTIFICATION_PING'),
      notify: this._actionHelper('notify'),
    }
  }

  mutations(this: NotificationModule) {
    return {
      NOTIFICATION_PING: (state: CommonState & { messages: [] }, { result }: MutationProps) => {
        state.messages = result
      }
    }
  }
}
