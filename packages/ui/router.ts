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
    path: '/user',
    name: 'user',
    component: () => import('./components/sv-auth-wall/sv-auth-wall.vue'),
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
        components: {
          default: () => import('./views/dashboard/crud-view/crud-view.vue'),
          topbar: () => import('./components/dashboard/sv-crud-topbar/sv-crud-topbar.vue')
        },
        meta: {
          title: '%viewTitle%',
        }
      },
      {
        path: 'c/user',
        name: 'dashboard-user',
        components: {
          default: () => import('./views/dashboard/user/user.vue'),
          topbar: () => import('./components/dashboard/sv-crud-topbar/sv-crud-topbar.vue')
        },
        meta: {
          title: 'Usuários',
          icon: 'user-circle',
          collection: 'user'
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
            path: 'profile',
            name: 'dashboard-user-profile',
            components: {
              default: () => import('./views/dashboard/user/profile/profile.vue'),
              topbar: () => import('./views/dashboard/user/_internals/components/sv-profile-topbar.vue'),
            },
            meta: {
              title: 'Meu perfil',
              icon: 'user-square'
            }
          },
          {
            path: 'changepass',
            name: 'dashboard-user-changepass',
            component: () => import('./views/dashboard/user/password-change/password-change.vue'),
            meta: {
              title: 'Mudar senha',
              icon: 'lock'
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
