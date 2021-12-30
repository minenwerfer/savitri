"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessController = void 0;
const Access_1 = require("../models/Access");
const Mutable_1 = require("./abstract/Mutable");
class AccessController extends Mutable_1.Mutable {
    constructor() {
        super(Access_1.Access, Access_1.Description, {
            publicMethods: ['getAll']
        });
    }
}
exports.AccessController = AccessController;
//# sourceMappingURL=AccessController.js.map