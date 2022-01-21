"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const Report_1 = require("../models/Report");
const Mutable_1 = require("./abstract/Mutable");
class ReportController extends Mutable_1.Mutable {
    constructor() {
        super(Report_1.Report, Report_1.Description, {
            publicMethods: ['getAll']
        });
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=ReportController.js.map