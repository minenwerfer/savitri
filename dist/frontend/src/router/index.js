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
exports.extendRouter = exports.instance = exports.routes = exports.makeRoutes = exports.privateRoutes = exports.publicRoutes = exports.BareTemplate = void 0;
const vue_router_1 = require("vue-router");
/**
 * @exports
 * Just a bare template for nested children.
 */
exports.BareTemplate = {
    template: `<router-view />`
};
/**
 * @exports
 * Non authenticated routes.
 */
exports.publicRoutes = [
    {
        path: '/',
        name: 'landing',
        component: () => Promise.resolve().then(() => __importStar(require('frontend/components/views/SvLanding/SvLanding.vue'))),
        meta: { title: 'Página inicial', hidden: true, }
    },
    {
        path: '/signin',
        name: 'signin',
        component: () => Promise.resolve().then(() => __importStar(require('frontend/components/views/SvSignIn/SvSignIn.vue'))),
        meta: { title: 'Autenticação', hidden: true, }
    }
];
/**
 * @exports
 * Authenticated routes.
 */
exports.privateRoutes = [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => Promise.resolve().then(() => __importStar(require('frontend/components/templates/SvDashboard/SvDashboard.vue'))),
        redirect: { name: 'dashboard-home' },
        meta: { title: 'Dashboard' },
        children: [
            {
                path: 'c/:module?',
                name: 'dashboard-crud',
                component: () => Promise.resolve().then(() => __importStar(require('frontend/components/views/SvDashboard/SvCrudView/SvCrudView.vue'))),
                meta: { title: '%viewTitle%', hidden: true, }
            },
            {
                path: 'access-edit',
                name: 'dashboard-access-edit',
                component: () => Promise.resolve().then(() => __importStar(require('frontend/components/views/SvDashboard/SvAccessProfile/SvAccessProfileEdit.vue'))),
                meta: { title: 'Editar preset de acesso', hidden: true }
            },
            {
                path: 'user-profile',
                name: 'dashboard-user-profile',
                component: () => Promise.resolve().then(() => __importStar(require('frontend/components/views/SvDashboard/SvUser/SvProfile/SvProfile.vue'))),
                meta: { title: 'Meu perfil', hidden: true }
            },
            {
                path: 'user-changepass',
                name: 'dashboard-user-changepass',
                component: () => Promise.resolve().then(() => __importStar(require('frontend/components/views/SvDashboard/SvUser/SvPasswordChange/SvPasswordChange.vue'))),
                meta: { title: 'Mudar senha', hidden: true }
            }
        ]
    }
];
/**
 * @function
 * Recursively labels routes.
 */
const labelRoute = (target, meta) => {
    const route = Object.assign({}, target);
    Object.assign(route, meta);
    if (route.children && Array.isArray(route.children)) {
        route.children = route.children.map((child) => labelRoute(child, meta));
    }
    return route;
};
/**
 * @exports
 */
const makeRoutes = (publicRoutes, privateRoutes) => {
    return [
        ...publicRoutes.map((route) => labelRoute(route, { isPrivate: false })),
        ...privateRoutes.map((route) => labelRoute(route, { isPrivate: true })),
    ];
};
exports.makeRoutes = makeRoutes;
/**
 * @exports
 * All routes. You may import it for using in whatever component.
 */
exports.routes = (0, exports.makeRoutes)(exports.publicRoutes, exports.privateRoutes);
/**
 * @exports
 * The router instance.
 */
const instance = (store) => {
    const router = (0, vue_router_1.createRouter)({
        history: (0, vue_router_1.createWebHistory)(),
        routes: exports.routes
    });
    // eslint-disable-next-line
    router.beforeEach(async (to, from, next) => {
        /**
         * @remarks
         * Will wait for module registration if necessary.
         */
        if (!(store.state.meta?.globalDescriptions?.length > 0)) {
            await new Promise((resolve) => {
                /**
                 * @event __storeCreated
                 * Will fire as soon as modules are dinamically registered.
                 */
                window.removeEventListener('__storeCreated', resolve);
                window.addEventListener('__storeCreated', resolve);
            });
        }
        store.dispatch('meta/setViewTitle', to.meta.title);
        if (process.env.NODE_ENV === 'development') {
            return next();
        }
        if (to.meta.isPrivate && !store.getters['user/token']) {
            next({ name: 'signin' });
        }
        else
            next();
    });
    router.afterEach(() => {
        window.scrollTo(0, 0);
    });
    return router;
};
exports.instance = instance;
const extendRouter = (router, routerExtension) => {
    Object.entries(routerExtension)
        .forEach(([parentName, routes]) => {
        routes.forEach((route) => router.addRoute(parentName, route));
    });
};
exports.extendRouter = extendRouter;
//# sourceMappingURL=index.js.map