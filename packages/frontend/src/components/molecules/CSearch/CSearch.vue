<template>
  <div class="mt-6" :key="parent">
    <header class="font-semibold mb-1">{{ moduleName }}</header>
    <div v-if="isExpanded" class="mb-2">
      <c-form :form="fields" :form-data="item" :padding-bottom="0">
      </c-form>
      <div v-if="!expand" class="text-sm">
        <c-button @clicked="insert" class="justify-self-end mr-2">Salvar</c-button>
        <c-button @clicked="clear">Limpar</c-button>
      </div>
    </div>

    <div v-else class="flex">
      <c-input class="flex-1 pr-4" @input="lazySearch" v-model="inputValue" v-if="!field.purge">{{ label }}</c-input>
      <c-button class="self-end text-sm" v-if="array" @clicked="addItem">Adicionar</c-button>
    </div>

    <div v-if="!isExpanded || array">
      <div :class="`grid select-none ${isLoading ? 'opacity-30' : ''}`">
        <div v-for="(item, index) in items" :key="`item-${index}`" @click="select(item)">
          <div class="cursor-pointer p-2 border">{{ item[fieldName] }}</div>
        </div>
      </div>

        <div v-if="selected.length > 0" class="mt-4">
        <div v-for="(item, index) in selected" :key="`item-${index}`" class="flex gap-x-2 px-2 py-1 border">
          <div class="flex-1">{{ item[fieldName] }}</div>
          <c-bare-button @clicked="edit(item)">
            <unicon name="edit" fill="black"></unicon>
          </c-bare-button>
          <c-bare-button @clicked="unselect(item)">
            <unicon name="trash" fill="black"></unicon>
          </c-bare-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, computed, ref, defineAsyncComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { CInput, CButton, CBareButton } from 'frontend/components'

export default {
  components: {
    CInput,
    CButton,
    CBareButton,
    CForm: defineAsyncComponent(() => import('frontend/components/molecules/CForm/CForm.vue')),
  },

  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    propName: {
      type: String,
      required: true,
    },
    field: {
      type: Object,
      required: true,
    },
    fieldName: {
      type: String,
      required: true
    }
  },

  methods: {
    async insert() {
      const result = await this.store.dispatch(`${this.module}/insert`, { what: this.item })

      const item = (() => {
        if( !this.array ) {
          return result
        }

        const selected = this.rawItem
          .filter(({ _id }) => !!_id && result._id !== _id)

        return [
          ...selected,
          result
        ]

      })()

      const parent = await this.store.dispatch(`${this.parentModule}/insert`, {
        what: {
          _id: this.parent._id,
          // [this.array ? '$addToSet' : '$set']: {
            //[this.propName]: result._id
          // }

          [this.propName]: item
        }
      })

      this.$emit('update:modelValue', parent[this.propName])

      this.store.dispatch(`${this.field.module}/clearAll`)
      this.expanded = false
    },

    edit(item) {
      const itemsCount = this.rawItem.length

      if( itemsCount > 0 ) {
        const swap = this.rawItem[itemsCount - 1]
        const itemIndex = this.rawItem.findIndex(({ _id }) => item._id === _id)
        this.rawItem[itemsCount - 1] = item
        this.rawItem[itemIndex] = swap
      }

      this.expanded = true
    },

    clear() {
      this.expanded = false
      this.store.dispatch(`${this.module}/clear`)
      if( this.array ) {
        this.rawItem = this.rawItem.slice(0, -1)
      }
    },

    select(item) {
      const filterEmpties = (array) => array.filter(e => typeof e !== 'object' || Object.keys(e).length > 0)
      const modelValue = this.array
        ? filterEmpties(Array.isArray(this.modelValue) ? this.modelValue : [this.modelValue])
        : this.modelValue

      this.inputValue = ''
      this.store.dispatch(`${this.module}/clearAll`)
      this.$emit('update:modelValue', this.array
        ? [ ...modelValue, item ]
        : item
      )
    },

    async unselect(item) {
      if( this.field.purge ) {
        const { _id } = item
        await this.store.dispatch(`${this.field.module}/remove`, { payload: { filter: { _id } }})
      }

      this.$emit('update:modelValue', this.array
          ? this.modelValue.filter((option) => option._id !== item._id)
          : undefined
      )
    },

    addItem() {
      this.rawItem.push({})
      this.expanded = true
    },

    search(value) {
      if( value.length === 0 ) {
        this.store.dispatch(`${this.module}/clearAll`)
        return
      }

      if( this.store.state[this.module].isLoading ) {
        return
      }

      this.store.dispatch(`${this.module}/getAll`, {
        filter: {
          ...(this.activeOnly ? { active: true } : {}),
          [this.field]: {
            $regex: value.trim(),
            $options: 'i'
          }
        }
      })
    },

    lazySearch({ target: { value } }) {
      window.clearTimeout(window.__lazySearchTimeout)
      window.__lazySearchTimeout = setTimeout(() => {
        this.search(value)
      }, 800)
    }
  },

  setup(props) {
    const store = useStore()
    const module = inject('module')
    const expanded = ref(false)

    const field = props.field

    onMounted(() => store.dispatch(`${field.module}/clearAll`))

    return {
      store,
      parentModule: module,
      
      module: computed(() => field.module),
      expand: computed(() => field.expand === true),
      array: computed(() => field.array),
      activeOnly: computed(() => 'active' in field.fields),
      moduleName: computed(() => (field.label||'').capitalize()),
      label: computed(() => Object.values(field.fields)[0]?.label),

      expanded,
      isExpanded: computed(() => expanded.value || field.expand),
      fields: computed(() => store.getters[`${field.module}/fields`]),
      rawItem: computed(() => {
        const item = store.state[module._value].item[props.propName]
        const items = field.array
          ? (Array.isArray(item) ? item : [item])
          : item

        return items
      }),
      item: computed(() => {
        const item = store.state[module._value].item[props.propName]

        return Array.isArray(item)
          ? item[item.length > 0 ? item.length - 1 : 0]||{}
          : item
      }),
      items: computed(() => store.state[field.module].items),
      parent: computed(() => store.state[module._value].item),
      isLoading: computed(() => store.state[field.module].isLoading),

      inputValue: ref(''),
      selected: computed(() => {
        const options = props.modelValue
        const selected = field.array
          ? Array.isArray(options) ? options : [options]
          : (Object.keys(options||{}).length > 0 ? [options] : [])

        return selected
          .filter(({ _id }) => !!_id)
      })
    }
  }
}
</script>
