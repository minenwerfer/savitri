"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModule = void 0;
const module_1 = require("frontend/store/module");
class ReportModule extends module_1.Module {
    constructor() {
        super('report', {}, {});
    }
    actions() {
        return {
            download: ({}, { payload }) => {
                window.open(module_1.SV_API_URL + `/download/${payload.filters.file._id}/download`);
            }
        };
    }
}
exports.ReportModule = ReportModule;
//# sourceMappingURL=index.js.map