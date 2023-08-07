"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstanceConfig = void 0;
const promises_1 = require("fs/promises");
const getInstanceConfig = async () => {
    const config = await (async () => {
        try {
            const content = await (0, promises_1.readFile)('./instance.json');
            return JSON.parse(content.toString());
        }
        catch (e) {
            return {};
        }
    })();
    const { exposed = {}, icons = [] } = config;
    return {
        exposed,
        icons
    };
};
exports.getInstanceConfig = getInstanceConfig;
