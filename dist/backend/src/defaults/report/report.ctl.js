"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const { writeFile } = require('fs').promises;
const path = require('path');
const helpers_1 = require("../../../../common/src/helpers");
const Entity = __importStar(require("../../../../common/src/entity"));
const report_mdl_1 = require("./report.mdl");
const controller_1 = require("../../controller");
const controller_2 = require("../../controller");
const file_mdl_1 = require("../file/file.mdl");
class ReportController extends controller_1.Mutable {
    _formatMap = {
        'csv': this._saveCSV,
        'pdf': this._savePDF
    };
    constructor() {
        super(report_mdl_1.Report, report_mdl_1.Description, {
            publicMethods: ['getAll']
        });
    }
    _getFields(description) {
        const filter = (entries) => {
            return (0, helpers_1.fromEntries)(entries.filter(([_, value]) => !value.noreport));
        };
        const table = description.reportFields || description.table;
        const entries = !table
            ? Object.entries(description.fields)
            : Object.entries(description.fields)
                .filter(([key, _]) => table.includes(key));
        return filter(entries);
    }
    _getColumns(fields) {
        return Object.values(fields).map((f) => f.label);
    }
    _filename(ext) {
        if (!process.env.REPORTS_PATH) {
            throw new Error('REPORTS_PATH not set');
        }
        return `report_${Date.now().toString()}.${ext}`;
    }
    async _saveCSV(columns, rows) {
        const filename = this._filename('csv');
        const buffer = rows.reduce((a, r) => (a.concat(Object.values(r).join(',') + '\n')), columns.join(',') + '\n');
        await writeFile(path.join(process.env.REPORTS_PATH, filename), buffer);
        return {
            filename,
            mime: 'text/csv'
        };
    }
    async _savePDF(columns, rows) {
        throw new Error('not implemented');
    }
    async insert(props, req, decodedToken) {
        if (!props.what?.format) {
            throw new Error('especifique um formato');
        }
        if (!(props.what?.format in this._formatMap)) {
            throw new Error('formato inválido');
        }
        if (!props.what?.type) {
            throw new Error('especifique um tipo');
        }
        if (props.what?.limit <= 0) {
            throw new Error('limite inválido');
        }
        if (!decodedToken.access?.capabilities[props.what?.module].includes('report')) {
            throw new Error('forbidden method');
        }
        props.what.filters = props.what.type !== 'everything'
            ? (props.what.filters || {})
            : {};
        const Controller = (0, controller_2.getController)(props.what.module);
        const instance = new Controller;
        const description = instance.describe();
        if (!description.report) {
            throw new Error('você não pode gerar um relatório desse módulo');
        }
        const fields = this._getFields(description);
        const columns = this._getColumns(fields);
        const fieldsNames = Object.keys(fields);
        const result = await instance.getAll({
            filters: props.what.filters,
            limit: +(props.what.limit || 99999999),
            offset: +(props.what.offset || 0)
        });
        const rows = result
            .map((r) => r._doc || r)
            .map((r) => fieldsNames.reduce((a, b) => ({ ...a, [b]: r[b] ? r[b] : '' }), {}))
            .map((r) => {
            return Object.entries(r)
                .filter(([key]) => key in fields)
                .reduce((a, [key, value]) => ({
                ...a,
                [key]: (() => {
                    const val = Entity.formatValue(description, value, key, false, fields[key]);
                    return val.includes(',') && props.what.format === 'csv'
                        ? `"${val}"`
                        : val;
                })()
            }), {});
        });
        const func = this._formatMap[props.what.format];
        const { filename, mime } = await func.call(this, columns, rows);
        props.what.entries_count = rows.length;
        props.what.file = await file_mdl_1.File.create({
            user_id: decodedToken._id,
            context: 'report',
            filename,
            mime,
            absolute_path: path.join(process.env.REPORTS_PATH, filename),
            immutable: true
        });
        return super.insert.call(this, props);
    }
    async download(_id) {
        const file = report_mdl_1.Report.findOne({ _id }).lean();
        if (!file) {
            throw new Error('report not found');
        }
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=report.ctl.js.map