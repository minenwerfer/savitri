"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const Controller_1 = require("./abstract/Controller");
class ApplicationController extends Controller_1.Controller {
    constructor() {
        super({
            publicMethods: ['manifest'],
            description: {
                module: 'application'
            }
        });
    }
    manifest() {
        return {
            display: 'standalone',
            start_url: '/',
            icons: [
                {
                    src: 'icons/icon72x72',
                    sizes: '72x72',
                    type: 'image/png'
                }
            ],
            name: '',
            short_name: '',
            description: '',
            theme_color: '',
            background_color: ''
        };
    }
}
exports.ApplicationController = ApplicationController;
