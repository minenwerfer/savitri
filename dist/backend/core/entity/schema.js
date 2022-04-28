"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.descriptionToSchema = void 0;
const mongoose_1 = require("mongoose");
const preset_1 = require("./preset");
// import { v1 as uuidv1 } from 'uuid'
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
const descriptionToSchema = ({ strict, fields, ...props }, options = {}, extra = {}) => {
    let hasRefs = false;
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
            required: value.required || strict,
            autopopulate: (typeof moduleName === 'string' && !value.preventPopulate) || false,
        };
        const typeMatch = typeMapping.find(([keys, _]) => keys.includes(value.type));
        if (typeMatch) {
            result.type = typeMatch[1];
        }
        if (typeof moduleName === 'string') {
            hasRefs = true;
            result.ref = moduleName.capitalize();
            result.type = value.array || Array.isArray(value.values)
                ? [ObjectId]
                : ObjectId;
            if (value._id === false) {
                result.type = value.array
                    ? [Object]
                    : Object;
            }
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
    const initial = {
    // _id: {
    //   type: String,
    //   default: uuidv1
    // }
    };
    props.presets?.forEach((name) => {
        (0, preset_1.applyPreset)(fields, name, 'fields');
    });
    const schemaStructure = Object.entries(fields)
        .filter(([, field]) => !field.meta)
        .reduce(convert, { ...extra, ...initial });
    const schema = new mongoose_1.Schema(schemaStructure, options);
    if (hasRefs) {
        schema.plugin(require('mongoose-autopopulate'));
    }
    return schema;
};
exports.descriptionToSchema = descriptionToSchema;
//# sourceMappingURL=schema.js.map