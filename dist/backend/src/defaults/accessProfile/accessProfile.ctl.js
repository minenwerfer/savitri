"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessProfileController = void 0;
const accessProfile_mdl_1 = require("./accessProfile.mdl");
const controller_1 = require("../../controller");
class AccessProfileController extends controller_1.Mutable {
    constructor() {
        super(accessProfile_mdl_1.AccessProfile, accessProfile_mdl_1.Description, {
            publicMethods: ['getAll']
        });
    }
}
exports.AccessProfileController = AccessProfileController;
//# sourceMappingURL=accessProfile.ctl.js.map