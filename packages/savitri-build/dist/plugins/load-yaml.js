"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = require("js-yaml");
const constants_1 = require("../constants");
exports.default = () => {
    return {
        name: `${constants_1.PLUGIN_PREFIX}:load-yaml`,
        transform(code, id) {
            if (!/ya?ml/.test(id)) {
                return null;
            }
            const data = (0, js_yaml_1.load)(code);
            return {
                code: `const data = ${JSON.stringify(data)};\nexport default data;`,
                map: null
            };
        }
    };
};
