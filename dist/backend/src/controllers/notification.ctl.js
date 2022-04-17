"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const Mutable_1 = require("./abstract/Mutable");
const Notification_1 = require("../models/Notification");
const http_1 = require("../../../common/src/http");
const token_svc_1 = require("../services/token.svc");
const path = require('path');
const buildConfig = require(path.join(process.cwd(), 'build.json'));
class NotificationController extends Mutable_1.Mutable {
    constructor() {
        super(Notification_1.Notification, Notification_1.Description, {
            publicMethods: [
                'ping'
            ]
        });
        this.http = new http_1.RequestProvider({ baseURL: process.env.DOMAIN_API_URL });
    }
    async ping(props, res, decodedToken) {
        if (!decodedToken?._id) {
            return {};
        }
        const result = {
            local: [],
            domain: []
        };
        if (!props.localOnly && buildConfig.domain && buildConfig.domainNotifications) {
            if (!this.http.token) {
                delete decodedToken.iat;
                delete decodedToken.exp;
                this.http.token = token_svc_1.TokenService.sign(decodedToken, process.env.DOMAIN_SECRET);
            }
            const { data: { result: { local } } } = await this.http.post('/notification/ping', { localOnly: true });
            result.domain = local;
        }
        result.local = await super.getAll.call(this, {
            filters: {
                $or: [
                    { destination: decodedToken._id },
                    { destination: null }
                ],
                ...(props.last_id ? { _id: { $gt: props.last_id } } : {})
            }
        }).select({ destination: 0 });
        return result;
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.ctl.js.map