<template>
  <div class="mt-6">
    <header class="font-semibold mb-1">{{ moduleName }}</header>
    <div v-if="isExpanded">
      <c-form :form="fields" :form-data="item">
      </c-form>
      <div v-if="!expand">
        <c-bare-button @clicked="insert" class="justify-self-end mr-2">Salvar</c-bare-button>
        <c-bare-button @clicked="clear">Limpar</c-bare-button>
      </div>
    </div>

    <div v-else class="flex">
      <c-input class="flex-1 pr-4" @input="lazySearch" v-model="inputValue">{{ label }}</c-input>
      <c-bare-button class="self-end" v-if="array" @clicked="expanded = true">Adicionar</c-bare-button>
    </div>

    <div v-if="!isExpanded">
      <div :class="`grid select-none ${isLoading ? 'opacity-30' : ''}`">
        <div v-for="(item, index) in items" :key="`item-${index}`" @click="select(item)">
          <div class="cursor-pointer p-2 border">{{ item[field] }}</div>
        </div>
      </div>

        <div v-if="selected.length > 0" class="mt-4">
        <div v-for="(item, index) in selected" :key="`item-${index}`" class="flex justify-between p-2 border">
          <div>{{ item[field] }}</div>
          <c-bare-button @clicked="unselect(item)">Deletar</c-bare-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, computed, ref, defineAsyncComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { CInput, CBareButton } from 'frontend/components'

export default {
  components: {
    CInput,
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
    module: {
      type: String,
      required: true,
    },
    moduleName: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    array: {
      type: Boolean,
      required: true,
    },
    expand: {
      type: Boolean,
      default: false,
    },
    activeOnly: {
      type: Boolean,
      default: false,
    }
  },

  methods: {
    async insert() {
      const result = await this.store.dispatch(`${this.module}/insert`, { what: this.item })
      this.store.commit(`${this.parentModule}/ITEM_GET`, {
        result: {
          ...this.store.state[this.parentModule].item,
          [this.propName]: result
        }
      })

      this.expanded = false
    },

    clear() {
      this.expanded = false
      this.store.dispatch(`${this.module}/clear`)
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

    unselect(item) {
      this.$emit('update:modelValue', this.array
          ? this.modelValue.filter((option) => option._id !== item._id)
          : undefined
      )
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

    onMounted(() => store.dispatch(`${props.module}/clearAll`))

    return {
      store,
      parentModule: module,
      expanded,
      isExpanded: computed(() => expanded.value || props.expand),
      fields: computed(() => store.getters[`${props.module}/fields`]),
      item: computed(() => store.state[module._value].item[props.propName]),
      items: computed(() => store.state[props.module].items),
      isLoading: computed(() => store.state[props.module].isLoading),

      inputValue: ref(''),
      selected: computed(() => {
        const options = props.modelValue
        return props.array
          ? options
          : (Object.keys(options||{}).length > 0 ? [options] : [])
      })
    }
  }
}
</script>
