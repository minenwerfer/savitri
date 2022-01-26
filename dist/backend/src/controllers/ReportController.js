"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const { writeFile } = require('fs').promises;
const path = require('path');
const Report_1 = require("../models/Report");
const Mutable_1 = require("./abstract/Mutable");
const index_1 = require("./index");
const File_1 = require("../models/File");
class ReportController extends Mutable_1.Mutable {
    constructor() {
        super(Report_1.Report, Report_1.Description, {
            publicMethods: ['getAll']
        });
        this.formatMap = {
            'csv': this._saveCSV,
            'pdf': this._savePDF
        };
    }
    _getFields(description) {
        return !description.table
            ? description.fields
            : Object.entries(description.fields)
                .filter(([key, _]) => description.table.includes(key))
                .reduce((a, [key, value]) => ({ ...a, [key]: value }), {});
    }
    _getColumns(fields) {
        return Object.values(fields).map((f) => f.label);
    }
    _formatValue(field, value) {
        if (!value || typeof value !== 'object') {
            return value ? value : '-';
        }
        const getFirstValue = (v, index) => {
            const entry = Array.isArray(field.values)
                ? field.values[0]
                : field.values;
            if (entry?.__query) {
                return v[entry.__query.index];
            }
            const i = Array.isArray(index) ? index[0] : index;
            return v[i];
        };
        return Array.isArray(value)
            ? value.map((v) => getFirstValue(v, field.index)).join(', ')
            : getFirstValue(value, field.index);
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
        if (!(props.what?.format in this.formatMap)) {
            throw new Error('formato inválido');
        }
        props.what.user_id = decodedToken._id;
        props.what.filters = props.what.type !== 'everything'
            ? (props.what.filters || {})
            : {};
        const Controller = (0, index_1.getController)(props.what.module);
        const instance = new Controller;
        const description = instance.describe();
        if (!description.report) {
            throw new Error('você não pode gerar um relatório desse módulo');
        }
        const fields = this._getFields(description);
        const columns = this._getColumns(fields);
        const fieldsNames = Object.keys(fields);
        const result = await instance.getAll({ filters: props.what.filters });
        const rows = result
            .map((r) => r._doc)
            .map((r) => fieldsNames.reduce((a, b) => ({ ...a, [b]: r[b] ? r[b] : '' }), {}))
            .map((r) => {
            return Object.entries(r)
                .filter(([key]) => key in fields)
                .reduce((a, [key, value]) => ({
                ...a,
                [key]: this._formatValue(fields[key], value)
            }), {});
        });
        const func = this.formatMap[props.what.format];
        const { filename, mime } = await func.call(this, columns, rows);
        props.what.file = await File_1.File.create({
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
        const file = Report_1.Report.findOne({ _id }).lean();
        if (!file) {
            throw new Error('report not found');
        }
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=ReportController.js.map