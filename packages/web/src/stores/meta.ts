import { defineStore } from 'pinia'
import { CollectionDescription } from '../../../common/types'
import { freshItem } from '../helpers/store'
import useHttp from '../http'
import useUtil from './_util'
import useCollection from './_collection'

import { useStore, hasStore, registerStore } from '../store'

type CollectionName = string

const { http } = useHttp()
const { parseQuery } = useUtil()

type ViewLayout =
  'tabular'
  | 'grid'
  | 'list'

type MetaState = {
  descriptions: Array<CollectionDescription>

  isLoading: boolean
  globalIsLoading: boolean

  view: {
    title: string
    layout: ViewLayout
    collection: string
  }
  menu: {
    isVisible: boolean
    isMobileVisible: boolean
  }
  modal: {
    isVisible: boolean
    title: string
    body: string
    image?: string
    component?: string
    details: {}
  }
  prompt: {
    isVisible: boolean
    title: string
    body?: string
    actions: Array<{
      name: string
      title: string
      type?: string
    }>
  }
  sidebar: {
    isVisible: boolean
    title: string
    component: string
    componentProps: any
  }
  toast: {
    isVisible: boolean
    text: string
  }
}

export default defineStore('meta', {
  state: (): MetaState => ({
    descriptions: [],

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
    sidebar: {
      isVisible: false,
      title: '',
      component: '',
      componentProps: {}
    },
    toast: {
      isVisible: false,
      text: '',
    },
  }),

  actions: {
    async describeAll() {
      const response = await http.get('_/meta/describeAll')
      const descriptions: Record<CollectionName, CollectionDescription> =
        this.descriptions = response.data?.result

      // monkeypatchs '@savitri/web/stores' object
      for ( const [collectionName, description] of Object.entries(descriptions) ) {
        const rawDescription = Object.assign({}, description)
        const item = freshItem(description)

        description.fields = await parseQuery(description.fields, false)

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
    },

    swapMenu() {
      this.menu.isVisible = !this.menu.isVisible
      localStorage.setItem('meta:menu:isVisible', String(this.menu.isVisible))
    },

    spawnPrompt(props: Omit<MetaState['prompt'], 'isVisible'>) {
      this.$patch({
        prompt: {
          ...props,
          isVisible: true
        }
      })
    },

    spawnModal(props: Omit<MetaState['modal'], 'isVisible'>) {
      this.$patch({
        modal: {
          ...props,
          isVisible: true
        }
      })
    },

    spawnToast(props: Omit<MetaState['toast'], 'isVisible'>) {
      this.$patch({
        toast: {
          ...props,
          isVisible: true
        }
      })
    }
  }
})
