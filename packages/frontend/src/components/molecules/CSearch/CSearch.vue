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

<script setup lang="ts">
import { inject, computed, ref, defineAsyncComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { CInput, CButton, CBareButton } from 'frontend/components'

const CForm = defineAsyncComponent(() => import('frontend/components/molecules/CForm/CForm.vue'))

const props = defineProps<{
  modelValue: any
  propName: string
  field: any
  fieldName: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
}>()

const store = useStore()
const parentModule = inject('module')
const expanded = ref(false)

const field = props.field

onMounted(() => store.dispatch(`${field.module}/clearAll`))

const module = computed(() => field.module)
const expand = computed(() => field.expand === true)
const array = computed(() => field.array)
const activeOnly = computed(() => 'active' in field.fields)
const moduleName = computed(() => (field.label||'').capitalize())
const label = computed(() => Object.values(field.fields)[0]?.label)

const isExpanded = computed(() => expanded.value || field.expand)
const fields = computed(() => store.getters[`${field.module}/fields`])
const rawItem = computed(() => {
  const item = store.state[parentModule.value].item[props.propName]
  const items = field.array
    ? (Array.isArray(item) ? item : [item])
    : item

  return items
})

const item = computed(() => {
  const _item = store.state[parentModule.value].item[props.propName]

  return Array.isArray(_item)
    ? _item[_item.length > 0 ? _item.length - 1 : 0]||{}
    : _item
})

const items = computed(() => store.state[field.module].items)
const parent = computed(() => store.state[parentModule.value].item)
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

const insert = async () => {
  const result: any = await store.dispatch(`${module.value}/insert`, { what: item.value })

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

  const parentResult = await store.dispatch(`${parentModule}/insert`, {
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

  if( itemsCount > 0 ) {
    const swap = rawItem.value[itemsCount - 1]
    const itemIndex = rawItem.value.findIndex(({ _id }: { _id: string }) => item._id === _id)
    rawItem.value[itemsCount - 1] = item
    rawItem.value[itemIndex] = swap
  }

  expanded.value = true
}

const clear = () => {
  expanded.value = false
  store.dispatch(`${module.value}/clear`)
  if( array.value ) {
    // rawItem.value = rawItem.value.slice(0, -1)
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
  // refatorar
//  rawItem.value.push({})
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
      [props.field]: {
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
