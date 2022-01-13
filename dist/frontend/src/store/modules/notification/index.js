"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const module_1 = require("frontend/store/module");
class NotificationModule extends module_1.Module {
    constructor() {
        super('notification', {}, {}, module_1.SV_API_URL_2);
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
                console.log(result);
            }
        };
    }
}
exports.NotificationModule = NotificationModule;
//# sourceMappingURL=index.js.map