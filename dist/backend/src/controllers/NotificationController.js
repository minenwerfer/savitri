"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const Mutable_1 = require("./abstract/Mutable");
const Notification_1 = require("../models/Notification");
class NotificationController extends Mutable_1.Mutable {
    constructor() {
        super(Notification_1.Notification, Notification_1.Description, {
            publicMethods: [
                'ping'
            ]
        });
    }
    async insert(props, res, decodedToken) {
        props.what.user_id = decodedToken._id;
        return super.insert.call(this, props);
    }
    async ping(props, res, decodedToken) {
        if (!decodedToken?._id) {
            return {};
        }
        return super.getAll.call(this, {
            filter: {
                destination: decodedToken._id,
                // _id: { $gt: props.last_id }
            }
        }).select({ destination: 0 });
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=NotificationController.js.map