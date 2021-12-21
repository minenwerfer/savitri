import { Module, ActionProps } from 'frontend/store/module'
import { AxiosResponse } from 'common/http'

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
  globalIsLoading: boolean,
  globalDescriptions: any[],
  viewTitle: string,

  menu: {
    isVisible: boolean;
    isMobileVisible: boolean;
  },
  modal: {
    isVisible: boolean
    title: string
    body: string,
    component: string
    details: {}
  },
  prompt: {
    isVisible: boolean
    title: string
    body: string
    actions: PromptAction[]
  },
  crud: {
    isInsertVisible: boolean;
    isInsertReadonly: boolean;
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
        title: 'Teste',
        body: 'Lorem ipsum dolor sit amet',
        component: '',
        details: {}
      },
      prompt: {
        isVisible: false,
        title: 'Teste',
        body: 'Lorem ipsum dolor sit amet',
        actions: [],
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
      isInsertReadonly: (state: any) => state.crud.isInsertReadonly
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
          Object.entries(data?.result).forEach(([, module]) => {
            commit('DESCRIPTIONS_ADD', module)
          })

          resolve(data?.result)
        })
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
      }
    }
  }

  mutations() {
    return {
      GLOBAL_LOADING_SWAP: (state: any, value: boolean) => {
        state.globalIsLoading = typeof value === 'boolean' ? value : !state.globalIsLoading
      },

      VIEW_TITLE_SET: (state: any, value: string) => {
        state.viewTitle = value
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

      MENU_SWAP: (state: any, { desktop, mobile }: { desktop?: boolean, mobile?: boolean }): void => {
        state.menu.isVisible = typeof desktop === 'boolean' ? desktop : !state.menu.isVisible;
        state.menu.isMobileVisible = typeof mobile === 'boolean' ? mobile : !state.menu.isMobileVisible;
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

      PROMPT_FULFILL: (state: any, option: string) => {
        window.dispatchEvent(new CustomEvent('__prompt', {
          detail: { option }
        }))
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
      }
    }
  }
}
