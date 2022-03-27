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
exports.useModule = void 0;
const vue_1 = require("vue");
const helpers_1 = require("common/helpers");
const Entity = __importStar(require("common/entity"));
const getters = [
    'item',
    'condensedItem',
    'items',
    'fields',
    'filters',
    'availableFilters',
    'description',
    'tableDescription',
    'selectedIds',
    'individualActions',
    'queryCache'
];
const props = [
    'recordsCount',
    'recordsTotal',
    'isLoading',
    'selected'
];
const actions = [
    'get',
    'getAll',
    'insert',
    'deepInsert',
    'modify',
    'remove',
    'clear'
];
const useModule = (name, store) => {
    const description = () => store.state[name].__description;
    const self = {
        useFields: (fields, except = false) => {
            return (0, helpers_1.fromEntries)(Object.entries(store.getters[`${name}/fields`])
                .filter(([key]) => except ? !fields.includes(key) : fields.includes(key)));
        },
        useFieldsExcept: (fields) => {
            return self.useFields(fields, true);
        },
        getIndexes: (key, form = false) => {
            return Entity.getIndexes(description(), key, form);
        },
        getFirstIndex: (key, form = false) => {
            return Entity.getFirstIndex(description(), key, form);
        },
        getFirstValue: (value, key, form = false) => {
            return Entity.getFirstValue(description(), value, key, form, name);
        },
        formatValue: (value, key, form = false, field) => {
            return Entity.formatValue(description(), value, key, form, field);
        },
        resumeItem: (item) => {
            return Entity.resumeItem(description(), item);
        },
        getItemIndex: (item, items) => {
            return Entity.getItemIndex(item, items, name);
        },
        setItem: (item) => {
            store.commit(`${name}/ITEM_GET`, { result: item });
        },
        resumedItem: (0, vue_1.computed)(() => self.resumeItem(store.getters[`${name}/item`])),
        resumedItems: (0, vue_1.computed)(() => store.getters[`${name}/items`]?.map((i) => self.resumeItem(i))),
        ...getters.reduce((a, k) => ({ ...a, [k]: (0, vue_1.computed)(() => store.getters[`${name}/${k}`]) }), {}),
        ...props.reduce((a, k) => ({ ...a, [k]: (0, vue_1.computed)(() => store.state[name][k]) }), {}),
        ...actions.reduce((a, k) => ({ ...a, [k]: (payload) => store.dispatch(`${name}/${k}`, payload) }), {})
    };
    return self;
};
exports.useModule = useModule;
//# sourceMappingURL=module.js.map