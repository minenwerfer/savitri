import { Route, makeRoutes } from '../web/core/router'

/**
 * @exports
 * Non authenticated routes.
 */
export const publicRoutes: Array<Route> = [
  {
    path: '/',
    name: 'landing',
    redirect: '/user/signin',
    meta: { title: 'Página inicial', hidden: true, }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('./views/user/template.vue'),
    children: [
      {
        path: 'signin',
        name: 'user-signin',
        component: () => import('./views/user/signin/signin.vue'),
        meta: { title: 'Autenticação', hidden: true, }
      },
      {
        path: 'signup',
        name: 'user-signup',
        component: () => import('./views/user/signup/signup.vue'),
        meta: { title: 'Registro', hidden: true, }
      },
      {
        path: 'signup-extra',
        name: 'user-signup-extra',
        component: () => import('./views/user/signup-extra/signup-extra.vue'),
        meta: { title: 'Registro', hidden: true, }
      }
    ]
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: () => import('./views/not-found/not-found.vue'),
    meta: { title: 'Not found' }
  },
  {
    path: '/:catchAll(.*)',
    name: 'catchAll',
    redirect: '/not-found'
  }
]

/**
 * @exports
 * Authenticated routes.
 */
export const privateRoutes: Array<Route> = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./views/dashboard/template.vue'),
    redirect: { name: 'dashboard-home' },
    meta: { title: 'Dashboard' },
    children: [
      {
        path: 'c/:collection?',
        name: 'dashboard-crud',
        component: () => import('./views').then((m: any) => m.SvCrudView),
        meta: { title: '%viewTitle%', hidden: true, }
      },
      {
        path: 'user',
        name: 'dashboard-user2',
        meta: { title: 'Usuário' },
        redirect: { name: 'dashboard-user' },
        children: [
          {
            path: 'user-profile',
            name: 'dashboard-user-profile',
            component: () => import('./views').then((m: any) => m.SvProfile),
            meta: { title: 'Meu perfil', hidden: true }
          },
          {
            path: 'user-changepass',
            name: 'dashboard-user-changepass',
            component: () => import('./views').then((m: any) => m.SvPasswordChange),
            meta: { title: 'Mudar senha', hidden: true }
          }
        ]
      }
    ]
  }
]

/**
 * @exports
 * All routes. You may () => import it for using in whatever component.
 */
export const routes = makeRoutes(publicRoutes, privateRoutes)
