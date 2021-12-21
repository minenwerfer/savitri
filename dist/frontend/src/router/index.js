import { createRouter, createWebHistory } from 'vue-router';
/**
 * @exports
 * Just a bare template for nested children.
 */
export const BareTemplate = {
    template: `<router-view />`
};
/**
 * @exports
 * Non authenticated routes.
 */
export const publicRoutes = [
    {
        path: '/',
        name: 'landing',
        component: () => import('frontend/components/views/CLanding/CLanding.vue'),
        meta: { title: 'Página inicial', hidden: true, }
    },
    {
        path: '/signin',
        name: 'signin',
        component: () => import('frontend/components/views/CSignIn/CSignIn.vue'),
        meta: { title: 'Autenticação', hidden: true, }
    }
];
/**
 * @exports
 * Authenticated routes.
 */
export const privateRoutes = [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('frontend/components/templates/CDashboard/CDashboard.vue'),
        redirect: { name: 'dashboard-home' },
        meta: { title: 'Dashboard' },
        children: [
            {
                path: 'c/:module?',
                name: 'dashboard-crud',
                component: () => import('frontend/components/views/CDashboard/CCrudView/CCrudView.vue'),
                meta: { title: '%viewTitle%', hidden: true, }
            },
            {
                path: 'access-edit',
                name: 'dashboard-access-edit',
                component: () => import('frontend/components/views/CDashboard/CAccess/CAccessEdit.vue'),
                meta: { title: 'Editar preset de acesso', hidden: true }
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
export const makeRoutes = (publicRoutes, privateRoutes) => {
    return [
        ...publicRoutes.map((route) => labelRoute(route, { isPrivate: false })),
        ...privateRoutes.map((route) => labelRoute(route, { isPrivate: true })),
    ];
};
/**
 * @exports
 * All routes. You may import it for using in whatever component.
 */
export const routes = makeRoutes(publicRoutes, privateRoutes);
/**
 * @exports
 * The router instance.
 */
export const instance = (store) => {
    const router = createRouter({
        history: createWebHistory(),
        routes
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
export const extendRouter = (router, routerExtension) => {
    Object.entries(routerExtension)
        .forEach(([parentName, routes]) => {
        routes.forEach((route) => router.addRoute(parentName, route));
    });
};
