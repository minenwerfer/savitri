"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessProfileController = void 0;
const AccessProfile_1 = require("../models/AccessProfile");
const Mutable_1 = require("./abstract/Mutable");
class AccessProfileController extends Mutable_1.Mutable {
    constructor() {
        super(AccessProfile_1.AccessProfile, AccessProfile_1.Description, {
            publicMethods: ['getAll']
        });
    }
}
exports.AccessProfileController = AccessProfileController;
//# sourceMappingURL=accessProfile.ctl.js.map