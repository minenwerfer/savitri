import { Module, CommonState, MutationProps, SV_API_URL_2 } from 'frontend/store/module'

export class NotificationModule extends Module<{}, {}> {
  constructor() {
    super('notification', {}, {})
  }

  actions(this: NotificationModule) {
    return {
      ping: this._actionHelper('ping', 'NOTIFICATION_PING'),
      notify: this._actionHelper('notify'),
    }
  }

  mutations(this: NotificationModule) {
    return {
      NOTIFICATION_PING: (state: CommonState, { result }: MutationProps) => {
        console.log(result)
      }
    }
  }
}
