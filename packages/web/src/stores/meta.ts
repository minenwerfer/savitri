import { defineStore } from 'pinia'
import { deepClone, deserialize } from '@semantic-api/common'
import { Description } from '@semantic-api/types'

import { useHttp } from '../http'
import { useCollection } from '../state/collection'
import { useStore, hasStore, registerStore } from '../state/use'
import { freshItem, freshFilters } from '../state/helpers'

type CollectionName = string
type PromptAnswer = { name: string }

const { http } = useHttp()

export default defineStore('meta', {
  state: () => ({
    descriptions: [],
    roles: {},

    isLoading: false,
    globalIsLoading: false,

    theme: '',
    themeOverride: '',
    availableThemes: INSTANCE_VARS?.themes || [],
    
    view: {
      title: '',
      layout: 'tabular',
      collection: ''
    },
    wizard: {
      current: '',
      step: 1
    },
    menu: {
      isVisible: true,
      isMobileVisible: false
    },
    modal: {
      isVisible: false,
      title: '',
      body: '',
      component: '',
      details: {}
    },
    prompt: {
      isVisible: false,
      title: '',
      body: '',
      actions: [],
    },
    toasts: [],
  }),

  actions: {
    async describeAll() {
      this.isLoading = true
      const response = (await http('_/meta/describeAll'))?.data
      const deserialized = deserialize(response)

      const descriptions: Record<CollectionName, Description> =
        this.descriptions = deserialized.descriptions

      this.roles = deserialized.roles

      // monkeypatchs '@savitri/web/stores' object
      for ( const [collectionName, description] of Object.entries(descriptions) ) {
        const rawDescription = Object.assign({}, description)
        const item = freshItem(description)
        const filters = freshFilters(description)

        if( !description.properties ) {
          throw new Error(
            `collection ${collectionName} has no properties`
          )
        }

        if( hasStore(collectionName) ) {
          const store = useStore(collectionName)
          store.$patch({
            item,
            filters,
            freshItem: deepClone(item),
            freshFilters: deepClone(filters),
            _description: description,
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
            filters,
            freshItem: deepClone(item),
            freshFilters: deepClone(filters),
            _description: description,
            rawDescription
          }),

          actions,
          getters
        })

        registerStore(store)
        store()
      }

      this.isLoading = false
    },

    swapMenu() {
      this.menu.isVisible = !this.menu.isVisible
      localStorage.setItem('meta:menu:isVisible', String(this.menu.isVisible))
    },

    spawnPrompt(props: {
      title?: string
      body?: string
      actions: Array<{
        name: string
        title: string
        size?: string
        variant?: string
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

    spawnModal(props: Partial<Omit<typeof this['modal'], 'isVisible'>>) {
      this.$patch({
        modal: {
          ...props,
          isVisible: true
        }
      })
    },

    spawnToast(
      this: { toasts: Array<any> },
      props: {
        text: string
        icon?: string
      }
    ) {
      this.toasts.push({
        ...props,
        itr: Math.random(),
        idx: this.toasts.length,
        date: new Date()
      })
    },

    popToast(this: { toasts: Array<any> }, itr?: Date) {
      if( !itr ) {
        this.toasts.shift()
        return
      }

      this.toasts = this.toasts
        .filter((toast) => toast.itr !== itr)
    },

    saveTheme() {
      localStorage.setItem('meta:theme', this.theme)
    },
  },

  getters: {
    $theme(): string {
      const theme = this.themeOverride || this.theme
      if( !theme ) {
        const defaultTheme = 'default'
        this.theme = localStorage.getItem('meta:theme') || defaultTheme
        return this.theme
      }

      return theme
    },
  }
})
