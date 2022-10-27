import { Route } from '../web/core/router'

const publicRoutes: Array<Route> = [
  {
    path: '/',
    name: 'landing',
    redirect: '/user/signin',
    meta: { title: 'Página inicial' }
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
        meta: { title: 'Autenticação' }
      },
      {
        path: 'signup',
        name: 'user-signup',
        component: () => import('./views/user/signup/signup.vue'),
        meta: { title: 'Registro' }
      },
      {
        path: 'signup-extra',
        name: 'user-signup-extra',
        component: () => import('./views/user/signup-extra/signup-extra.vue'),
        meta: { title: 'Registro' }
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

const privateRoutes: Array<Route> = [
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
        component: () => import('./views/dashboard/crud-view/crud-view.vue'),
        meta: { title: '%viewTitle%' }
      },
      {
        path: 'c/user',
        name: 'dashboard-user',
        component: () => import('./views/dashboard/user/user.vue'),
        meta: { title: 'Usuários' }
      },
      {
        path: 'user',
        name: 'dashboard-user-group',
        meta: { title: 'Usuário' },
        redirect: { name: 'dashboard-user' },
        children: [
          {
            path: 'user-profile',
            name: 'dashboard-user-profile',
            component: () => import('./views/dashboard/user/profile/profile.vue'),
            meta: { title: 'Meu perfil' }
          },
          {
            path: 'user-changepass',
            name: 'dashboard-user-changepass',
            component: () => import('./views/dashboard/user/password-change/password-change.vue'),
            meta: { title: 'Mudar senha' }
          }
        ]
      }
    ]
  }
]

export default [
  ...publicRoutes,
  ...privateRoutes
]
