<template>
  <div :key="parent" @change.prevent.stop="" class="search relative w-full border-t py-4 rounded">
    <header class="text-lg mb-4">{{ moduleName }}</header>
    <div v-if="isExpanded" class="flex flex-col gap-y-2">
      <sv-form
        :form="moduleRefs.fields"
        :form-data="edited"
        :item-index="itemIndex"
        :field-index="fieldIndex"
      ></sv-form>
      <div class="flex gap-x-1" v-if="!expand">
        <sv-button @clicked="insert">Salvar</sv-button>
        <sv-button @clicked="clear">Limpar</sv-button>
      </div>
    </div>

    <div v-else class="flex flex-wrap gap-2">
      <div
        v-for="([indexName, searchField], index) in indexes.map((i) => [i, field.fields[i]])"
        :key="`searchField-${index}`"
        class="flex flex-grow items-end gap-x-2"
      >
        <sv-input
          @input="lazySearch(indexName, inputValue[indexName])"
          v-model="inputValue[indexName]"
          v-if="!field.purge"

          class="flex-grow"
        >
            {{ searchField.label }}
        </sv-input>
        <sv-button
          v-if="array"
          icon="plus"
          @clicked="addItem"
        >
          Novo
        </sv-button>
      </div>
    </div>

    <div v-if="!isExpanded || array" :key="inputValue">
      <div v-if="selected.length > 0">
        <sv-item v-for="(item, index) in selected" :key="`item-${index}`">
          <div class="flex justify-between gap-x-2">
            <div class="flex-1">{{ item[indexes[0]] }}</div>

            <div v-if="!searchOnly" class="flex gap-x-1 search__icons">
              <sv-bare-button @clicked="edit(item)">
                <sv-icon name="edit" fill="gray"></sv-icon>
              </sv-bare-button>
              <sv-bare-button @clicked="unselect(item)">
                <sv-icon name="trash" fill="gray"></sv-icon>
              </sv-bare-button>
            </div>

            <div v-else>
              <sv-bare-button @clicked="unselect(item, false)">
                <sv-icon name="minus" fill="gray"></sv-icon>
              </sv-bare-button>
            </div>

          </div>

        </sv-item>
      </div>

      <div :class="`select-none ${isLoading ? 'opacity-30' : 'opacity-60'}`" v-if="!isExpanded">
        <div v-if="items.length || selected.length" class="grid">
          <sv-item v-for="(item, index) in items" :key="`item-${index}`" @click="select(item)" class="bg-white">
            <div class="flex justify-between gap-x-2 cursor-pointer">
              <div>{{ item[indexes[0]] }}</div>
              <sv-icon name="plus" fill="gray"></sv-icon>
            </div>
          </sv-item>
        </div>
        <div v-else class="p-2 text-sm">
          <div v-if="isTyping">
            Pesquisando...
          </div>
          <div v-else-if="!isLoading && Object.values(inputValue).filter((v) => !!v).length > 0">
            Não há resultados
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {
  provide,
  inject,
  computed,
  ref,
  reactive,
  defineAsyncComponent,
  onMounted

} from 'vue'
import { useStore } from 'vuex'
import { useModule } from '../../../../frontend'

import {
  SvInput,
  SvButton,
  SvBareButton,
  SvIcon

} from '../..'

import SvItem from './_internals/components/sv-item/sv-item.vue'
const SvForm = defineAsyncComponent(() => import('../../molecules/sv-form/sv-form.vue'))

const props = defineProps<{
  modelValue: any
  propName: string
  field: any
  itemIndex?: number
  indexes: any
  activeOnly?: boolean
  searchOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
  (e: 'changed'): void
}>()

const store = useStore()
const _parentModule = inject<{ value: string }>('module', { value: '' })
const parentModule = _parentModule.value || _parentModule

const searchOnly = inject<boolean>('searchOnly', props.searchOnly)

const parentRefs = useModule(parentModule, store)
const moduleRefs = reactive(useModule(props.field.module, store))

const field = props.field
provide('module', field.module)
provide('iconReactive', true)

onMounted(() => store.dispatch(`${field.module}/clearAll`))

const expanded = ref<boolean>(false)
const edited = ref<any>(parentRefs.item.value[props.propName])

const module = computed(() => field.module)
const expand = computed(() => field.expand === true)
const array = computed(() => field.array)

const moduleName = computed(() => (field.label||'').capitalize())
const isExpanded = computed(() => expanded.value || field.expand)

const rawItem = computed(() => {
  const item = store.state[parentModule].item[props.propName]
  const items = field.array
    ? (Array.isArray(item) ? item : [item])
    : item

  return items
})

const items = computed(() => store.state[field.module].items)
const parent = computed<{ _id: string }>(() => store.state[parentModule].item)
const isLoading = computed(() => store.state[field.module].isLoading)
const isTyping = ref(false)

const inputValue = reactive({})

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

  const parentResult = await store.dispatch(`${parentModule}/insert`, {
    what: {
      ...(parent.value._id ? { _id: parent.value._id } : parent.value),
      [props.propName]: value
    }
  })

  emit('update:modelValue', parentResult[props.propName])
  store.dispatch(`${props.field.module}/clearAll`)
  expanded.value = false
}

const edit = (item: any) => {
  const itemsCount = rawItem.value.length
  fieldIndex.value = parentRefs.getItemIndex(item._id, selected.value)

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

  store.dispatch(`${module.value}/clearAll`)
  emit('update:modelValue', array.value
    ? [ ...modelValue, item ]
    : item
  )

  emit('changed')
}

const unselect = async (item: any, purge=true) => {
  if( props.field.purge && purge ) {
    const { _id } = item
    await store.dispatch(`${props.field.module}/remove`, { payload: { filter: { _id } }})
  }

  emit('update:modelValue', array.value
      ? props.modelValue.filter((option: any) => option._id !== item._id)
      : undefined
  )
}

const addItem = () => {
  fieldIndex.value = selected.value.length + 1

  edited.value = {}
  expanded.value = true
}

const search = () => {
  if( Object.values(inputValue).every((v: string) => v.length === 0) ) {
    store.dispatch(`${module.value}/clearAll`)
    return
  }

  if( store.state[module.value].isLoading ) {
    return
  }

  store.dispatch(`${module.value}/getAll`, {
    limit: 5,
    filters: {
      ...(props.activeOnly ? { active: true } : {}),
      $or: props.indexes
      .filter((i: string) => inputValue[i]?.length > 0)
      .map((i: string) => ({
        [i]: {
          $regex: inputValue[i].trim(),
          $options: 'i'
        }
      }))
    }
  })
}

declare global {
  interface Window {
    __lazySearchTimeout: any
  }
}

const lazySearch = (searchField: string, value: string) => {
  isTyping.value = true
  window.clearTimeout(window.__lazySearchTimeout)
  window.__lazySearchTimeout = setTimeout(() => {
    search()
    isTyping.value = false
  }, 800)
}
</script>

<style scoped src="./sv-search.scss"></style>
