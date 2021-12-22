"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useI18n = void 0;
const vue_i18n_1 = require("vue-i18n");
const useI18n = (options) => {
    if (options) {
        const messages = Object.entries(options.messages)
            .reduce((a, [key, value]) => ({
            [key]: {
                ...value,
                ...require(`data/i18n/${key}/index.json`)
            }
        }), {});
        return (0, vue_i18n_1.createI18n)({
            ...options,
            messages
        });
    }
    return (0, vue_i18n_1.createI18n)({
        locale: 'pt_BR',
        messages: {
            pt_BR: require(`data/i18n/pt_BR/index.json`)
        }
    });
};
exports.useI18n = useI18n;
