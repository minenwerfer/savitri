<template>
  <div class="search">
    <div v-if="isExpanded">
      <sv-form
        v-bind="{
          collection: field.collection,
          form: field.form
            ? store.useFields(field.form)
            : store.fields,
          formData: edited,
          layout: store.formLayout,
          fieldIndex
        }"
      >
        <template #header v-if="!omitFormHeader">
          {{ $t(field.collection||'').capitalize() }}
        </template>
      </sv-form>
      <div v-if="!field.inline">
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
      >
        <template #header v-if="!omitFormHeader">
          {{ $t(field.collection||'').capitalize() }}
        </template>
      </sv-form>
      <sv-button
        v-if="expanded && field.array"
        icon="plus"
        @clicked="addItem"
      >
        Novo
      </sv-button>
    </div>

    <div v-if="!isExpanded || field.array" :key="inputValue">
      <sv-search-selected
        v-model="modelValue"
        v-bind="{
          searchOnly,
          indexes,
          field,
        }"
        @update:model-value="emit('update:modelValue', $event)"
      ></sv-search-selected>

      <div v-if="!isExpanded">
        <div v-if="matchingItems.length || modelValue?.length">
          <sv-search-item
            v-for="item in matchingItems"
            v-bind="{
              item,
              indexes
            }"

            :key="`matching-${item._id}`"
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
          <div v-else-if="
            !store.isLoading
              && Object.values(inputValue).filter((v) => !!v).length > 0
              && !((field.array && modelValue?.length) || modelValue?._id)
          ">
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

} from 'vue'

import { useStore, useParentStore } from '@savitri/web'
import { SvButton, SvIcon } from '../../../../..'

import SvSearchSelected from '../sv-search-selected/sv-search-selected.vue'
import SvSearchItem from '../sv-search-item/sv-search-item.vue'

const SvForm = defineAsyncComponent(() => import('../../../../../molecules/sv-form/sv-form.vue'))

type Props = {
  modelValue: any
  fieldName: string
  parentCollection?: string
  searchOnly?: boolean

  field: {
    array?: boolean
    collection?: string
    inline?: boolean
    form?: any
    inlineEditing?: boolean
    label?: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
  (e: 'changed'): void
}>()

provide('iconReactive', true)

const boxProps = reactive({
  float: false,
  fill: true
})

const searchOnly = !props.field.inlineEditing || inject<boolean>('searchOnly', null)
const omitFormHeader = inject('omitFormHeader', false)

const parentStore = useParentStore(props.parentCollection)
const store = useStore(props.field.collection)

const indexes = parentStore.getIndexes({
  key: props.fieldName
})

const expanded = ref(false)
const edited = ref(parentStore.item[props.fieldName])
const matchingItems = ref([])

const isExpanded = computed(() => expanded.value || props.field.inline)

const rawItem = computed(() => {
  const item = parentStore.item[props.fieldName]
  const items = props.field.array
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
    if( !props.field.array ) {
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
      [props.fieldName]: value
    }
  })

  emit('update:modelValue', parentResult[props.fieldName])
  matchingItems.value = []
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
  matchingItems.value = []
  if( props.field.array ) {
    rawItem.value = rawItem.value.slice(0, -1)
  }
}

const select = (item: any) => {
  const filterEmpties = (array: Array<any>) => array.filter(e => typeof e !== 'object' || Object.keys(e).length > 0)
  const modelValue = props.field.array
    ? filterEmpties(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue])
    : props.modelValue

  matchingItems.value = []
  emit('update:modelValue', props.field.array
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

const search = async () => {
  if( Object.values(inputValue).every((v: string) => !(String(v).length > 0)) ) {
    matchingItems.value = []
    return
  }

  if( store.isLoading ) {
    return
  }

  matchingItems.value = (await store.custom('getAll', {
    limit: 5,
    filters: {
      $or: indexes
      .filter((i: string) => inputValue[i]?.length > 0)
      .map((i: string) => ({
        [i]: {
          $regex: inputValue[i].trim(),
          $options: 'i'
        }
      }))
    }
  })).result
}

let lazySearchTimeout
const lazySearch = () => {
  isTyping.value = true
  window.clearTimeout(lazySearchTimeout)
  lazySearchTimeout = setTimeout(() => {
    search()
    isTyping.value = false
  }, 800)
}
</script>

<style scoped src="./sv-search.scss"></style>
