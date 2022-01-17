"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = exports.initialState = void 0;
const module_1 = require("frontend/store/module");
exports.initialState = {
    messages: []
};
class NotificationModule extends module_1.Module {
    constructor() {
        super('notification', exports.initialState, {});
    }
    getters() {
        return {
            unread: (state) => {
                return state.messages;
            }
        };
    }
    actions() {
        return {
            ping: this._actionHelper('ping', 'NOTIFICATION_PING'),
            notify: this._actionHelper('notify'),
        };
    }
    mutations() {
        return {
            NOTIFICATION_PING: (state, { result }) => {
                state.messages = result;
            }
        };
    }
}
exports.NotificationModule = NotificationModule;
//# sourceMappingURL=index.js.map