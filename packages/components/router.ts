import { Route, makeRoutes } from '../web/core/router'

/**
 * @exports
 * Non authenticated routes.
 */
export const publicRoutes: Array<Route> = [
  {
    path: '/',
    name: 'landing',
    redirect: '/signin',
    meta: { title: 'Página inicial', hidden: true, }
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('./views/signin/signin.vue'),
    meta: { title: 'Autenticação', hidden: true, }
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
    component: () => import('./components/templates').then((m: any) => m.SvDashboard),
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
        path: 'access-edit',
        name: 'dashboard-access-edit',
        component: () => import('./views').then((m: any) => m.SvAccessProfile),
        meta: { title: 'Editar preset de acesso', hidden: true }
      },
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

/**
 * @exports
 * All routes. You may () => import it for using in whatever component.
 */
export const routes = makeRoutes(publicRoutes, privateRoutes)
