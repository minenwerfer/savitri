"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const controller_1 = require("../../core/controller");
const notification_model_1 = require("./notification.model");
const index_json_1 = __importDefault(require("./index.json"));
const http_1 = require("../../../common/src/http");
const token_svc_1 = require("../../core/services/token.svc");
const path = require('path');
const buildConfig = require(path.join(process.cwd(), 'build.json'));
class NotificationController extends controller_1.Mutable {
    constructor() {
        super(notification_model_1.Notification, index_json_1.default, {
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
//# sourceMappingURL=notification.controller.js.map