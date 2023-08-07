"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_util_1 = require("node:util");
const modes_js_1 = require("./modes.js");
const { values: opts } = (0, node_util_1.parseArgs)({
    options: {
        mode: {
            type: 'string',
            short: 'm'
        }
    }
});
function main() {
    switch (opts.mode) {
        case 'build':
            return (0, modes_js_1.build)();
        case 'serve':
            return (0, modes_js_1.serve)();
        default:
            throw new Error(`mode ${opts.mode} not found`);
    }
}
main();
