import { RouteRecordRaw } from 'vue-router'

const publicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'landing',
    redirect: '/user/signin',
    meta: {
      title: 'Página inicial'
    }
  },
  {
    path: '/external',
    name: 'external',
    component: () => import('./components/templates/sv-external/sv-external.vue'),
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('./components/templates/sv-auth-wall/sv-auth-wall.vue'),
    children: [
      {
        path: 'signin',
        name: 'user-signin',
        component: () => import('./views/user/signin.vue'),
        meta: {
          title: 'Autenticação'
        }
      },
      {
        path: 'signup',
        name: 'user-signup',
        component: () => import('./views/user/signup.vue'),
        meta: {
          title: 'Registro'
        }
      },
      {
        path: 'signup-extra',
        name: 'user-signup-extra',
        component: () => import('./views/user/signup-extra.vue'),
        meta: {
          title: 'Registro'
        }
      }
    ]
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: () => import('./views/not-found/not-found.vue'),
    meta: {
      title: 'Not found'
    }
  },
  {
    path: '/:catchAll(.*)',
    name: 'catchAll',
    redirect: '/not-found'
  }
]

const privateRoutes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./views/dashboard/template.vue'),
    redirect: { name: 'dashboard-home' },
    meta: {
      title: 'Dashboard'
    },
    children: [
      {
        path: 'c/:collection?',
        name: 'dashboard-crud',
        component: () => import('./views/dashboard/crud-view/crud-view.vue'),
        meta: {
          title: '%viewTitle%'
        }
      },
      {
        path: 'subscriptions',
        name: 'dashboard-subscriptions',
        component: () => import('./views/dashboard/subscriptions/subscriptions.vue'),
        meta: {
          title: 'Inscrições',
          icon: 'user-circle'
        }
      },
      {
        path: 'c/user',
        name: 'dashboard-user',
        component: () => import('./views/dashboard/user/user.vue'),
        meta: {
          title: 'Usuários',
          icon: 'user-circle'
        }
      },
      {
        path: 'user',
        name: 'dashboard-user-group',
        meta: {
          title: 'user'
        },
        redirect: {
          name: 'dashboard-user'
        },
        children: [
          {
            path: 'user-profile',
            name: 'dashboard-user-profile',
            component: () => import('./views/dashboard/user/profile/profile.vue'),
            meta: {
              title: 'Meu perfil'
            }
          },
          {
            path: 'user-changepass',
            name: 'dashboard-user-changepass',
            component: () => import('./views/dashboard/user/password-change/password-change.vue'),
            meta: {
              title: 'Mudar senha'
            }
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
