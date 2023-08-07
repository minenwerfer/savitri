"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_vue_1 = __importDefault(require("@vitejs/plugin-vue"));
const vite_2 = __importDefault(require("unplugin-vue-router/vite"));
const vite_3 = __importDefault(require("unplugin-vue-components/vite"));
const vite_4 = __importDefault(require("unplugin-auto-import/vite"));
const vite_5 = __importDefault(require("braun/vite"));
const common_1 = require("braun/common");
const sassData_js_1 = require("./sassData.js");
const instance_1 = require("./instance");
const transform_index_html_1 = __importDefault(require("./plugins/transform-index-html"));
const load_yaml_1 = __importDefault(require("./plugins/load-yaml"));
exports.default = (0, vite_1.defineConfig)(async () => {
    const instanceConfig = await (0, instance_1.getInstanceConfig)();
    const config = {
        publicDir: 'static',
        resolve: {
            alias: {
                'bson': require.resolve('bson')
            }
        },
        plugins: [
            (0, vite_5.default)({
                tag: 'sv-icon',
                hash: true,
                libraries: [
                    '@savitri/ui'
                ],
                async preEmit() {
                    process.env.SEMANTIC_API_SHALLOW_IMPORT = '1';
                    const { collections: userCollections } = require(process.cwd() + '/../api/dist/collections');
                    const systemCollections = require(process.cwd() + '/../api/node_modules/@semantic-api/system/dist/collections');
                    const collections = {
                        ...systemCollections,
                        ...userCollections
                    };
                    for (const collectionName in collections) {
                        const { description } = await collections[collectionName]();
                        if (!description) {
                            return;
                        }
                        const { icon, actions, individualActions } = description;
                        if (icon) {
                            common_1.icons.add(icon);
                        }
                        if (actions) {
                            Object.values(actions).forEach((action) => {
                                if (action?.icon) {
                                    common_1.icons.add(action.icon);
                                }
                            });
                        }
                        if (individualActions) {
                            Object.values(individualActions).forEach((action) => {
                                if (action?.icon) {
                                    common_1.icons.add(action.icon);
                                }
                            });
                        }
                    }
                }
            }),
            (0, vite_4.default)({
                exclude: [
                    /\/node_modules\//,
                    /\.git\//,
                    /\/@?savitri\//,
                ],
                imports: [
                    'vue',
                    {
                        '@savitri/web': [
                            'useHttp',
                            'useStore',
                            'useParentStore',
                            'useRouter',
                            'useClipboard',
                            'useAction',
                            'useCondition',
                            'useNavbar',
                        ]
                    },
                    {
                        '@semantic-api/common': [
                            'error',
                            'ok',
                            'isError',
                            'isOk',
                            'unpack',
                            'unsafe'
                        ]
                    }
                ]
            }),
            (0, vite_2.default)({
                routesFolder: process.cwd() + '/pages',
                exclude: [
                    '**/_*'
                ],
                dts: false
            }),
            (0, vite_3.default)({
                dirs: [
                    process.cwd() + '/components'
                ],
                resolvers: [
                    (componentName) => {
                        if (componentName.startsWith('Sv')) {
                            return {
                                name: componentName,
                                from: '@savitri/ui'
                            };
                        }
                    }
                ]
            }),
            (0, plugin_vue_1.default)(),
            (0, transform_index_html_1.default)(instanceConfig),
            (0, load_yaml_1.default)()
        ],
        optimizeDeps: {
            include: [
                'bson',
                '@semantic-api/types',
                '@semantic-api/common'
            ],
            exclude: [
                'vue-router'
            ]
        },
        build: {
            target: 'esnext'
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: (0, sassData_js_1.sassData)({})
                }
            }
        },
    };
    return config;
});
