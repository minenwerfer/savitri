<template>
  <div class="search">
    <header class="search__header">{{ collectionName }}</header>
    <div v-if="isExpanded">
      <sv-form
        v-bind="{
          collection,
          form: store.fields,
          formData: edited,
          itemIndex,
          fieldIndex
        }"
      ></sv-form>
      <div v-if="!expand">
        <sv-button @clicked="insert">Salvar</sv-button>
        <sv-button @clicked="clear">Limpar</sv-button>
      </div>
    </div>

    <div v-else>
      <sv-form
        v-bind="{
          collection: field.collection,
          form: store.useFields(indexes),
          formData: inputValue,
          layout: store.formLayout
        }"
        @input="lazySearch"
      ></sv-form>
      <sv-button
        v-if="expanded && array"
        icon="plus"
        @clicked="addItem"
      >
        Novo
      </sv-button>
    </div>

    <div v-if="!isExpanded || array" :key="inputValue">
      <sv-search-selected
        v-model="modelValue"
        v-bind="{
          searchOnly,
          indexes,
          field,
          array
        }"
      ></sv-search-selected>

      <div v-if="!isExpanded">
        <div v-if="store.items.length || modelValue?.length">
          <sv-search-item
            v-for="(item, index) in store.items"
            v-bind="{
              item,
              indexes
            }"

            :key="`item-${index}`"
            @click="select(item)"
          >
            <sv-icon
              name="plus"
              fill="gray"
            ></sv-icon>
          </sv-search-item>

        </div>
        <div v-else>
          <div v-if="isTyping">
            Pesquisando...
          </div>
          <div v-else-if="!store.meta.isLoading && Object.values(inputValue).filter((v) => !!v).length > 0">
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

import { useStore, useParentStore } from '@savitri/web'
import { SvButton, SvIcon } from '../../../../..'

import SvSearchSelected from '../sv-search-selected/sv-search-selected.vue'
import SvSearchItem from '../sv-search-item/sv-search-item.vue'

const SvForm = defineAsyncComponent(() => import('../../../../../molecules/sv-form/sv-form.vue'))

type Props = {
  modelValue: any
  propName: string
  collection: string
  field: any
  itemIndex?: number
  indexes: any
  activeOnly?: boolean
  searchOnly?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
  (e: 'changed'): void
}>()


const boxProps = reactive({
  float: false,
  fill: true
})

const searchOnly = props.searchOnly || inject<boolean>('searchOnly', null)

const parentStore = useParentStore(props.collection)
const store = useStore(props.field.collection)

provide('iconReactive', true)

onMounted(() => store.clearItems())

const field = props.field
const expanded = ref<boolean>(false)
const edited = ref<any>(parentStore.item[props.propName])

const collection = computed(() => field.collection)
const expand = computed(() => field.expand === true)
const array = computed(() => field.array)

const collectionName = computed(() => (field.label||'').capitalize())
const isExpanded = computed(() => expanded.value || field.expand)

const rawItem = computed(() => {
  const item = parentStore.item[props.propName]
  const items = field.array
    ? (Array.isArray(item) ? item : [item])
    : item

  return items
})

const isTyping = ref(false)
const inputValue = reactive({})

const fieldIndex = ref(0)

const insert = async () => {
  const result: any = await store.insert({ what: edited.value })

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

  const parentResult = await parentStore.insert({
    what: {
      ...(parentStore.item._id ? { _id: parentStore.item._id } : parentStore.item),
      [props.propName]: value
    }
  })

  emit('update:modelValue', parentResult[props.propName])
  store.clearItems()
  expanded.value = false
}

const edit = (item: any) => {
  const itemsCount = rawItem.value.length
  fieldIndex.value = parentStore.getItemIndex(item._id, props.modelValue)

  edited.value = item
  expanded.value = true
}

const clear = () => {
  expanded.value = false
  store.clearItems()
  if( array.value ) {
    rawItem.value = rawItem.value.slice(0, -1)
  }
}

const select = (item: any) => {
  const filterEmpties = (array: Array<any>) => array.filter(e => typeof e !== 'object' || Object.keys(e).length > 0)
  const modelValue = array.value
    ? filterEmpties(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue])
    : props.modelValue

  store.clearItems()
  emit('update:modelValue', array.value
    ? [ ...modelValue, item ]
    : item
  )

  emit('changed')
}

const addItem = () => {
  fieldIndex.value = props.modelValue.length + 1

  edited.value = {}
  expanded.value = true
}

const search = () => {
  if( Object.values(inputValue).every((v: string) => !(String(v).length > 0)) ) {
    store.clearItems()
    return
  }

  if( store.meta.isLoading ) {
    return
  }

  store.getAll({
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

const lazySearch = () => {
  isTyping.value = true
  window.clearTimeout(window.__lazySearchTimeout)
  window.__lazySearchTimeout = setTimeout(() => {
    search()
    isTyping.value = false
  }, 800)
}
</script>

<style scoped src="./sv-search.scss"></style>
