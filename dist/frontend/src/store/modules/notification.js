"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = exports.initialState = void 0;
const module_1 = require("../module");
exports.initialState = {
    messages: {
        local: [],
        domain: []
    }
};
class NotificationModule extends module_1.Module {
    constructor() {
        super('notification', exports.initialState, {});
    }
    getters() {
        return {
            unread: (state) => {
                return [
                    ...state.messages.local,
                    ...state.messages.domain,
                ];
            },
            localLast: (state) => {
                return 19;
            },
            domainLast: (state) => {
                return 20;
            }
        };
    }
    actions() {
        return {
            ping: (...args) => {
                const func = this._actionHelper('ping', 'NOTIFICATION_PING');
                const [{ getters: { localLast, domainLast } }] = args;
                return func(args[0], {
                    payload: {
                        localLast,
                        domainLast
                    }
                });
            },
            notify: this._actionHelper('notify'),
        };
    }
    mutations() {
        return {
            NOTIFICATION_PING: (state, { result }) => {
                state.messages.local = result.local;
                state.messages.domain = result.domain;
            }
        };
    }
}
exports.NotificationModule = NotificationModule;
//# sourceMappingURL=notification.js.map