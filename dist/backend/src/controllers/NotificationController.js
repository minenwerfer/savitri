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
    ping(props, res, decodedToken) {
        return decodedToken;
        // if( !decodedToken?._id ) {
        //   return {}
        // }
        // return super.get.call(this, {
        //   filter: {
        //     user_id: decodedToken._id,
        //     _id: { $gt: props.last_id }
        //   }
        // })
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=NotificationController.js.map