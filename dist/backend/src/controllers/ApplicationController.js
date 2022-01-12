"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const Controller_1 = require("./abstract/Controller");
const manifest_json_1 = __importDefault(require("../resources/manifest.json"));
const path = require('path');
const { readFile } = require('fs').promises;
const buildConfig = require(path.join(process.cwd(), 'build.json'));
class ApplicationController extends Controller_1.Controller {
    constructor() {
        super({
            publicMethods: [
                'manifest',
                'serviceWorker',
                'index'
            ],
            rawMethods: {
                'manifest': 'application/json',
                'serviceWorker': 'text/javascript',
                'index': 'text/html'
            },
            description: {
                module: 'application'
            }
        });
    }
    _replacePlaceholders(input, map) {
        return Object.entries(map).reduce((a, [key, value]) => {
            return a.replace(new RegExp(`{{ ${key} }}`, 'g'), value);
        }, input);
    }
    manifest() {
        return Object.assign(manifest_json_1.default, {
            name: buildConfig.product.name,
            short_name: buildConfig.product.shortName || buildConfig.product.name,
            description: buildConfig.product.description,
            theme_color: buildConfig.product.theme.foregroundColor,
            background_color: buildConfig.product.theme.backgroundColor,
        });
    }
    async serviceWorker() {
        const content = await readFile(path.join(__dirname, '../resources/serviceWorker.js'));
        return content;
    }
    async index() {
        const content = await readFile(path.join(__dirname, '../resources/index.html'));
        const initial_data = JSON.stringify(buildConfig);
        const config = Object.assign(buildConfig.product, {
            title: buildConfig.product.name,
            theme_color: buildConfig.product.theme.foregroundColor,
            background_color: buildConfig.product.theme.backgroundColor,
            initial_data
        });
        return this._replacePlaceholders(content.toString(), config);
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=ApplicationController.js.map