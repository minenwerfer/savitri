"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseController = void 0;
const yaml_1 = __importDefault(require("yaml"));
const Controller_1 = require("./abstract/Controller");
const path = require('path');
const { readFile } = require('fs').promises;
class ReleaseController extends Controller_1.Controller {
    constructor() {
        super({
            description: {
                module: 'release'
            }
        });
    }
    async getAll() {
        const baseRelease = await readFile(path.resolve(__dirname, '../../RELEASE.yml'), 'utf8');
        const productRelease = await readFile(path.resolve(process.cwd(), './RELEASE.yml'), 'utf8');
        const base = yaml_1.default.parse(baseRelease);
        const product = yaml_1.default.parse(productRelease);
        return {
            base,
            product
        };
    }
}
exports.ReleaseController = ReleaseController;
//# sourceMappingURL=ReleaseController.js.map