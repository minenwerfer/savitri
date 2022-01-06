<template>
  <div class="mt-6" :key="parent">
    <header class="font-semibold mb-1">{{ moduleName }}</header>
    <div v-if="isExpanded" class="mb-2">
      <sv-form :form="fields" :form-data="edited" :padding-bottom="0" :item-index="itemIndex" :field-index="fieldIndex">
      </sv-form>
      <div v-if="!expand" class="text-sm">
        <sv-button @clicked="insert" class="justify-self-end mr-2">Salvar</sv-button>
        <sv-button @clicked="clear">Limpar</sv-button>
      </div>
    </div>

    <div v-else class="flex">
      <sv-input class="flex-1 pr-4" @input="lazySearch" v-model="inputValue" v-if="!field.purge">{{ label }}</sv-input>
      <sv-button class="self-end text-sm" v-if="array" @clicked="addItem">Adicionar</sv-button>
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
          <sv-bare-button @clicked="edit(item)">
            <unicon name="edit" fill="black"></unicon>
          </sv-bare-button>
          <sv-bare-button @clicked="unselect(item)">
            <unicon name="trash" fill="black"></unicon>
          </sv-bare-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, inject, computed, ref, defineAsyncComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { SvInput, SvButton, SvBareButton } from 'frontend/components'
import useModule from 'frontend/composables/module'

const SvForm = defineAsyncComponent(() => import('frontend/components/molecules/SvForm/SvForm.vue'))

const props = defineProps<{
  modelValue: any
  propName: string
  field: any
  fieldName: string,
  itemIndex?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const store = useStore()
const parentModule = inject<{ value: string }>('module', { value: '' })

const moduleRefs = useModule(parentModule.value, store)

const field = props.field
provide('module', field.module)

onMounted(() => store.dispatch(`${field.module}/clearAll`))

const expanded = ref<boolean>(false)
const edited = ref<any>({})

const module = computed(() => field.module)
const expand = computed(() => field.expand === true)
const array = computed(() => field.array)
const activeOnly = computed(() => 'active' in field.fields)
const moduleName = computed(() => (field.label||'').capitalize())
const label = computed(() => (Object.values(field.fields)[0]||{} as any).label)

const isExpanded = computed(() => expanded.value || field.expand)
const fields = computed(() => store.getters[`${field.module}/fields`])
const rawItem = computed(() => {
  const item = store.state[parentModule.value].item[props.propName]
  const items = field.array
    ? (Array.isArray(item) ? item : [item])
    : item

  return items
})

const items = computed(() => store.state[field.module].items)
const parent = computed<{ _id: string }>(() => store.state[parentModule.value].item)
const isLoading = computed(() => store.state[field.module].isLoading)

const inputValue = ref('')
const selected = computed(() => {
  const options = props.modelValue
  const selected = field.array
    ? Array.isArray(options) ? options : [options]
    : (Object.keys(options||{}).length > 0 ? [options] : [])

  return selected
    .filter(({ _id }) => !!_id)
})

const fieldIndex = ref(0)

const insert = async () => {
  const result: any = await store.dispatch(`${module.value}/insert`, { what: edited.value })

  const value = (() => {
    if( !array.value ) {
      return result
    }

    const selected = rawItem.value
      .filter(({ _id }: { _id: string }) => !!_id && result._id !== _id)

    return [
      ...selected,
      result
    ]
  })()

  const parentResult = await store.dispatch(`${parentModule.value}/insert`, {
    what: {
      _id: parent.value._id,
      [props.propName]: value
    }
  })

  emit('update:modelValue', parentResult[props.propName])
  store.dispatch(`${props.field.module}/clearAll`)
  expanded.value = false
}

const edit = (item: any) => {
  const itemsCount = rawItem.value.length
  fieldIndex.value = moduleRefs.getItemIndex(item._id, selected.value)

  edited.value = item
  expanded.value = true
}

const clear = () => {
  expanded.value = false
  store.dispatch(`${module.value}/clear`)
  if( array.value ) {
    rawItem.value = rawItem.value.slice(0, -1)
  }
}

const select = (item: any) => {
  const filterEmpties = (array: any[]) => array.filter(e => typeof e !== 'object' || Object.keys(e).length > 0)
  const modelValue = array.value
    ? filterEmpties(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue])
    : props.modelValue

  inputValue.value = ''
  store.dispatch(`${module.value}/clearAll`)
  emit('update:modelValue', array.value
    ? [ ...modelValue, item ]
    : item
  )
}

const unselect = async (item: any) => {
  if( props.field.purge ) {
    const { _id } = item
    await store.dispatch(`${props.field.module}/remove`, { payload: { filter: { _id } }})
  }

  emit('update:modelValue', array.value
      ? props.modelValue.filter((option: any) => option._id !== item._id)
      : undefined
  )
}

const addItem = () => {
  fieldIndex.value = selected.value.length

  edited.value = {}
  expanded.value = true
}

const search = (value: string) => {
  if( value.length === 0 ) {
    store.dispatch(`${module.value}/clearAll`)
    return
  }

  if( store.state[module.value].isLoading ) {
    return
  }

  store.dispatch(`${module.value}/getAll`, {
    filter: {
      ...(activeOnly.value ? { active: true } : {}),
      [props.fieldName]: {
        $regex: value.trim(),
        $options: 'i'
      }
    }
  })
}

declare global {
  interface Window {
    __lazySearchTimeout: any
  }
}

const lazySearch = ({ target: { value } }: { target: { value: string } }) => {
  window.clearTimeout(window.__lazySearchTimeout)
  window.__lazySearchTimeout = setTimeout(() => {
      search(value)
    }, 800)
}
</script>
