"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportModule = void 0;
const module_1 = require("../module");
const composables_1 = require("../../composables");
const initialItemState = {
    limit: 150
};
class ReportModule extends module_1.Module {
    constructor() {
        super('report', {}, initialItemState);
    }
    actions() {
        return {
            download: ({}, { payload }) => {
                window.open((0, composables_1.useFile)(payload.filters.file).link);
            }
        };
    }
}
exports.ReportModule = ReportModule;
//# sourceMappingURL=report.js.map