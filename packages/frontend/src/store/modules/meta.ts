import { Module, ActionProps } from '../module'
import { AxiosResponse } from 'common/http'

import { default as webpackVariables } from 'variables'

/**
 * @exports @interface
 * Prompt actions.
 */
export interface PromptAction {
  title: string
}

/**
 * @exports @interface
 * Meta interface.
 */
export interface Meta {
  globalIsLoading: boolean
  globalDescriptions: any[]
  viewTitle: string

  menu: {
    isVisible: boolean
    isMobileVisible: boolean
  },
  modal: {
    isVisible: boolean
    title: string
    body: string
    image?: string
    component?: string
    details: {}
  },
  prompt: {
    isVisible: boolean
    title: string
    body: string
    actions: PromptAction[]
  },
  sidebar: {
    isVisible: boolean
    title: string
    component: string
  },
  toast: {
    isVisible: boolean
    text: string
    itr: number
  },
  report: {
    isVisible: boolean
  },
  crud: {
    isInsertVisible: boolean
    isInsertReadonly: boolean
  }
}

/**
 * @exports @class
 * Meta module.
 */
export class MetaModule extends Module<Meta, {}> {
  constructor() {
    super('meta', {
      globalIsLoading: false,
      globalDescriptions: [],
      viewTitle: '',
      menu: {
        isVisible: true,
        isMobileVisible: false,
      },
      modal: {
        isVisible: false,
        title: '',
        body: '',
        image: '',
        component: '',
        details: {}
      },
      prompt: {
        isVisible: false,
        title: '',
        body: '',
        actions: [],
      },
      sidebar: {
        isVisible: false,
        title: '',
        component: ''
      },
      toast: {
        isVisible: false,
        text: '',
        itr: 0
      },
      report: {
        isVisible: false
      },
      crud: {
        isInsertVisible: false,
        isInsertReadonly: false
      }
    }, {})
  }

  getters() {
    return {
      isInsertVisible: (state: any) => state.crud.isInsertVisible,
      isInsertReadonly: (state: any) => state.crud.isInsertReadonly,

      isMenuVisible: (state: any) =>  state.menu.isVisible,
      isMobileMenuVisible: (state: any) => state.menu.isMobileVisible,
    }
  }

  actions(this: MetaModule) {
    return {
      /**
       * @function
       * Fetchs all modules metadata from backend.
       * It may be accessed through _description.
       */
      describeAll: ({ commit }: ActionProps): Promise<any> => new Promise((resolve) => {

        commit('DESCRIPTIONS_CLEAR')

        this._http.get(this.route('describeAll')).then(({ data }: AxiosResponse) => {
          Object.entries(data?.result).forEach(([, result]) => {
            commit('DESCRIPTIONS_ADD', result)
          })

          resolve(data?.result)
        })
      }),

      describe: ({ commit }: ActionProps, modules: string[]): Promise<void> => new Promise(async (resolve) => {
        for (const module of modules) {
          await this._http.get(`/${module}/describe`).then(({ data }: AxiosResponse) => {
            commit('DESCRIPTIONS_ADD', data?.result)
          })
        }

        resolve()
      }),

      setViewTitle: ({ commit }: ActionProps, value: string): void => {
        commit('VIEW_TITLE_SET', value)
      },

      swapMenu: ({ commit }: ActionProps, value?: any): void => {
        commit('MENU_SWAP', value||{})
      },
      spawnModal: ({ commit }: ActionProps, payload: any): Promise<void> => new Promise((resolve) => {
        commit('MODAL_SPAWN', payload)

        const event = () => {
          window.removeEventListener('__modal', event)
          commit('MODAL_CLOSE')
          resolve()
        }

        window.addEventListener('__modal', event)
      }),

      closeModal: ({ commit }: ActionProps): void => {
        commit('MODAL_CLOSE')
      },
      spawnPrompt: ({ commit }: ActionProps, payload: any): Promise<string> => new Promise((resolve) => {
        commit('PROMPT_SPAWN', payload)

        const event = ({ detail }: any) => {
          window.removeEventListener('__prompt', event)
          commit('PROMPT_CLOSE')
          resolve(detail.option)
        }

        window.addEventListener('__prompt', event)
      }),

      closePrompt: ({ commit }: ActionProps): void => {
        commit('PROMPT_CLOSE')
      },
      fulfillPrompt: ({ commit }: ActionProps, option: string): void => {
        commit('PROMPT_FULFILL', option)
      },

      closeCrud: ({ commit }: ActionProps) => {
        commit('CRUD_CLOSE')
      },

      spawnSidebar: ({ commit }: ActionProps, payload: any) => {
        commit('SIDEBAR_SPAWN', payload)
      },

      closeSidebar: ({ commit }: ActionProps) => {
        commit('SIDEBAR_CLOSE')
      },

      spawnToast: ({ commit }: ActionProps, payload: any) => {
        commit('TOAST_SPAWN', payload)
      },

      closeToast: ({ commit }: ActionProps) => {
        commit('TOAST_CLOSE')
      },

      spawnReport: ({ commit }: ActionProps) => {
        commit('REPORT_SPAWN')
      },

      closeReport: ({ commit }: ActionProps) => {
        commit('REPORT_CLOSE')
      },
    }
  }

  mutations() {
    return {
      GLOBAL_LOADING_SWAP: (state: any, value: boolean) => {
        state.globalIsLoading = typeof value === 'boolean' ? value : !state.globalIsLoading
      },

      VIEW_TITLE_SET: (state: any, value: string) => {
        const translated = (window as any)._i18n.global.tc(value||'', 2)
          .capitalize()
          .replace('%viewTitle%', '-')

        state.viewTitle = translated
        document.title = `${webpackVariables.productName} | ${translated}`
      },

      DESCRIPTIONS_ADD: (state: any, module: any): void => {
        state.globalDescriptions = [
          ...state.globalDescriptions,
          module
        ]
      },

      DESCRIPTIONS_CLEAR: (state: any): void => {
        state.globalDescriptions = []
      },

      MENU_SWAP: (state: any, value: { isVisible?: boolean, isMobileVisible?: boolean }): void => {
        if( Object.keys(value).length > 0 ) {
          Object.assign(state.menu, value)
          return
        }

        state.menu.isVisible = !state.menu.isVisible
        state.menu.isMobileVisible = !state.menu.isMobileVisible

        localStorage.setItem('meta:menu:isVisible', state.menu.isVisible)
        localStorage.setItem('meta:menu:isMobileVisible', state.menu.isMobileVisible)
      },

      MODAL_SPAWN: (state: any, payload: any): void => {
        Object.assign(state.modal, {
          isVisible: true,
          ...payload
        })
      },

      MODAL_CLOSE: (state: any) => {
        Object.assign(state.modal, {
          isVisible: false,
          title: '',
          body: '',
          image: '',
          component: '',
          details: {}
        })

        window.dispatchEvent(new CustomEvent('__modal'))
      },

      PROMPT_SPAWN: (state: any, payload: any): void => {
        Object.assign(state.prompt, {
          isVisible: true,
          ...payload
        })
      },

      PROMPT_CLOSE: (state: any) => {
        Object.assign(state.prompt, {
          isVisible: false,
          title: '',
          body: '',
          actions: {}
        })
      },

      PROMPT_FULFILL: (_: unknown, option: string) => {
        window.dispatchEvent(new CustomEvent('__prompt', {
          detail: { option }
        }))
      },

      SIDEBAR_SPAWN: (state: any, payload: any) => {
        Object.assign(state.sidebar, {
          isVisible: true,
          ...payload
        })
      },

      SIDEBAR_CLOSE: (state: any) => {
        Object.assign(state.sidebar, {
          isVisible: false,
        })
      },

      TOAST_SPAWN:(state: any, payload: any) => {
        Object.assign(state.toast, {
          isVisible: true,
          itr: state.toast.itr + 1,
          ...payload
        })
      },

      TOAST_CLOSE: (state: any) => {
        Object.assign(state.toast, {
          isVisible: false
        })
      },

      REPORT_SPAWN: (state: any) => {
        state.report.isVisible = true
      },

      REPORT_CLOSE: (state: any) => {
        state.report.isVisible = false
      },

      CRUD_CLOSE: (state: any) => {
        state.crud.isInsertVisible = false
      },

      CRUD_EDIT: (state: any) => {
        state.crud.isInsertVisible = true
        state.crud.isInsertReadonly = false
      },

      CRUD_OPEN: (state: any) => {
        state.crud.isInsertVisible = true
        state.crud.isInsertReadonly = true
      },
    }
  }
}
