"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareInsert = exports.fill = exports.project = exports.select = exports.depopulateChildren = exports.depopulate = void 0;
const helpers_1 = require("../../../common/src/helpers");
const entity_1 = require("../../../common/src/entity");
const depopulate = (item, description) => {
    const entries = Object.entries(item._doc || item)
        .map(([key, value]) => ([
        key,
        !(description.fields[key] || {}).expand
            ? (0, exports.select)(value, (0, entity_1.getIndexes)(description, key))
            : value
    ]));
    return (0, helpers_1.fromEntries)(entries);
};
exports.depopulate = depopulate;
const depopulateChildren = (item) => {
    const depopulate = (i) => {
        if (!i || typeof i !== 'object' || !('_id' in i)) {
            return i;
        }
        return (0, helpers_1.fromEntries)(Object.entries(i._doc || i)
            .map(([key, value]) => [key, value?._id ? value._id : value]));
    };
    const { _id, ...doc } = item._doc || item;
    const entries = Object.entries(doc)
        .map(([key, value]) => [key, !Array.isArray(value) ? depopulate(value) : value.map((v) => depopulate(v))]);
    return {
        _id,
        ...(0, helpers_1.fromEntries)(entries)
    };
};
exports.depopulateChildren = depopulateChildren;
const select = (obj, fields) => {
    if (!obj || typeof obj !== 'object' || !fields) {
        return obj;
    }
    const sanitizedFields = ['_id', ...typeof fields === 'object' ? fields : [fields]];
    const _select = (what) => sanitizedFields.reduce((a, c) => ({ ...a, [c]: what[c] }), {});
    return Array.isArray(obj)
        ? obj.map((o) => _select(o))
        : _select(obj);
};
exports.select = select;
const project = (item, props) => {
    if (!props) {
        return item;
    }
    const obj = {
        _id: item._id
    };
    (Array.isArray(props) ? props : [props])
        .forEach((field) => {
        obj[field] = item[field];
    });
    return obj;
};
exports.project = project;
const fill = (obj, fields) => {
    if (!obj) {
        return {};
    }
    const missing = Object.entries(fields)
        .filter(([key, value]) => !obj[key] && !value.meta)
        .map(([key,]) => key)
        .reduce((a, b) => ({
        ...a,
        [b]: null
    }), {});
    return Object.assign(missing, obj._doc || obj);
};
exports.fill = fill;
const prepareInsert = (description, payload) => {
    const { _id, ...rest } = payload;
    const forbidden = (key) => {
        return (description.fields[key] || {}).readonly
            || (description.form && !description.form.includes(key));
    };
    const what = typeof _id === 'string' ? Object.entries(rest)
        .filter(([key]) => !forbidden(key))
        .reduce((a, [key, value]) => {
        const append = !value || (typeof value === 'object' ? Object.keys(value || {}).length : String(value).length) === 0
            ? '$unset' : '$set';
        a[append][key] = append === '$set' ? value : 1;
        return a;
    }, {
        $set: {},
        $unset: {}
    }) : rest;
    Object.keys(what)
        .filter(k => !what[k] || typeof what[k] === 'object' && Object.keys(what[k]).length === 0)
        .forEach(k => delete what[k]);
    return what;
};
exports.prepareInsert = prepareInsert;
//# sourceMappingURL=utils.js.map