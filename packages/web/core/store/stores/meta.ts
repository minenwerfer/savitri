import { defineStore } from 'pinia'
import { CollectionDescription } from '../../../../common/types'
import { freshItem } from '../../helpers/store'
import useHttp from '../../http'
import useCollection from '../collection'

import { useStore, hasStore, registerStore } from '../use'
import { hydrateQuery } from '../helpers'

type CollectionName = string
type PromptAnswer = { name: string }

const { http } = useHttp()

export default defineStore('meta', {
  state: () => ({
    descriptions: [],
    roles: {},

    isLoading: false,
    globalIsLoading: false,

    view: {
      title: '',
      layout: 'tabular',
      collection: ''
    },
    menu: {
      isVisible: true,
      isMobileVisible: false
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
    toast: {
      isVisible: false,
      text: '',
      itr: new Date
    },
  }),

  actions: {
    async describeAll() {
      this.isLoading = true
      const response = await http.get('_/meta/describeAll')
      const descriptions: Record<CollectionName, CollectionDescription> =
        this.descriptions = response.data.result.descriptions

      this.roles = response.data.result.roles

      // monkeypatchs '@savitri/web/stores' object
      for ( const [collectionName, description] of Object.entries(descriptions) ) {
        const rawDescription = Object.assign({}, description)
        const item = freshItem(description)

        description.fields = await hydrateQuery(description.fields, false)

        if( hasStore(collectionName) ) {
          const store = useStore(collectionName)
          store.$patch({
            item,
            freshItem: Object.assign({}, item),
            description,
            rawDescription
          })
          continue
        }

        const {
          state,
          actions,
          getters
        } = useCollection()

        const store = defineStore(collectionName, {
          state: () => Object.assign(state(), {
            item,
            freshItem: Object.assign({}, item),
            description,
            rawDescription
          }),

          actions,
          getters
        })

        registerStore(store)
      }

      this.isLoading = false
    },

    swapMenu() {
      this.menu.isVisible = !this.menu.isVisible
      localStorage.setItem('meta:menu:isVisible', String(this.menu.isVisible))
    },

    spawnPrompt(props: Omit<typeof this['prompt'], 'isVisible' | 'actions'> & {
      actions: Array<{
        name: string
        title: string
        type?: string
      }>
    }): Promise<PromptAnswer> {
      this.$patch({
        prompt: {
          ...props,
          isVisible: true
        } as any
      })

      return new Promise((resolve) => {
        const event = ({ detail }: any) => {
          window.removeEventListener('__prompt', event)
          this.prompt.isVisible = false
          resolve(detail.option)
        }

        window.addEventListener('__prompt', event)
      })
    },

    fulfillPrompt(answer: PromptAnswer) {
      window.dispatchEvent(new CustomEvent('__prompt', {
        detail: { option: answer }
      }))
    },

    spawnModal(props: Omit<typeof this['modal'], 'isVisible'>) {
      this.$patch({
        modal: {
          ...props,
          isVisible: true
        }
      })
    },

    spawnToast(props: Omit<typeof this['toast'], 'isVisible'>) {
      this.$patch({
        toast: {
          ...props,
          isVisible: true,
          itr: new Date
        }
      })
    }
  },
})
