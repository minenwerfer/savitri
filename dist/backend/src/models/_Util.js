"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descriptionToSchema = void 0;
const mongoose_1 = require("mongoose");
const { ObjectId } = mongoose_1.Schema.Types;
const typeMapping = [
    [['text', 'password', 'radio', 'select'], String],
    [['number', 'integer'], Number],
    [['checkbox'], [String]],
    [['object'], Object],
    [['boolean'], Boolean],
    [['datetime'], Date]
];
/**
 * @exports @function
 * Converts a description object into a mongoose Schema structure.
 */
const descriptionToSchema = ({ fields }, options = {}, extra = {}) => {
    const convert = (a, [key, value]) => {
        const query = Array.isArray(value.values || [])
            ? (value.values || [{}])[0]?.__query
            : value.values?.__query;
        const moduleName = query?.module || value.module;
        const result = {
            type: String,
            select: value.hidden !== true,
            unique: value.unique === true,
            default: value.default,
            required: value.required || false,
            autopopulate: (typeof moduleName === 'string' && !value.preventPopulate) || false,
        };
        const typeMatch = typeMapping.find(([keys, _]) => keys.includes(value.type));
        if (typeMatch) {
            result.type = typeMatch[1];
        }
        if (typeof moduleName === 'string') {
            result.ref = moduleName.capitalize();
            result.type = value.array || Array.isArray(value.values)
                ? [ObjectId]
                : ObjectId;
        }
        if (['checkbox', 'radio', 'select'].includes(value.type)) {
            result.validator = (v) => value.values.include(v);
        }
        if (['text'].includes(value.type) && value.required) {
            result.validator = (v) => !!v && v.length > 0;
        }
        return {
            ...a,
            [key]: result
        };
    };
    return new mongoose_1.Schema(Object.entries(fields).filter(([, field]) => !field.meta).reduce(convert, extra), options);
};
exports.descriptionToSchema = descriptionToSchema;
//# sourceMappingURL=_Util.js.map