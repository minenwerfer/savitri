<template>
  <div class="search">
    <div v-if="isExpanded">
      <sv-form
        v-bind="{
          collection: property.$ref,
          form: property.s$form
            ? store.useProperties(property.s$form)
            : store.propertys,
          formData: edited,
          layout: store.formLayout
        }"
      >
        <template #header v-if="!omitFormHeader">
          {{ $t(property.$ref||'').capitalize() }}
        </template>
      </sv-form>
      <div v-if="!property.s$inline">
        <sv-button @clicked="insert">Salvar</sv-button>
        <sv-button @clicked="clear">Limpar</sv-button>
      </div>
    </div>

    <div v-else>
      <sv-form
        v-bind="{
          collection: property.$ref,
          form: store.useProperties(indexes),
          formData: inputValue,
          layout: store.formLayout,
          searchOnly: true
        }"
        @input="lazySearch"
      >
        <template #header v-if="!omitFormHeader">
          {{ $t(property.$ref||'').capitalize() }}
        </template>
      </sv-form>
      <sv-button
        v-if="expanded && property.array"
        icon="plus"
        @clicked="addItem"
      >
        Novo
      </sv-button>
    </div>

    <div v-if="!isExpanded || property.s$array" :key="inputValue">
      <sv-search-selected
        v-bind="{
          searchOnly,
          indexes,
          property,
          modelValue
        }"

        @update:model-value="emit('update:modelValue', $event)"
        @push-back="pushBack"
      ></sv-search-selected>

      <div v-if="!isExpanded">
        <sv-search-container v-if="matchingItems.length || modelValue?.length">
          <sv-search-item
            v-for="(item, index) in matchingItems"
            v-bind="{
              item,
              indexes
            }"

            :key="`matching-${item._id}`"
            @click="select(item, +index)"
          >
            <sv-icon
              name="plus"
              fill="gray"
            ></sv-icon>
          </sv-search-item>
        </sv-search-container>

        <div v-else>
          <div v-if="isTyping">
            Pesquisando...
          </div>
          <div v-else-if="
            !store.isLoading
              && Object.values(inputValue).filter((v) => !!v).length > 0
              && !((property.type === 'array' && modelValue?.length) || modelValue?._id)
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

import type { CollectionProperty } from '../../../../../../../common'
import { useStore, useParentStore } from '../../../../../../../web'
import { SvButton, SvIcon } from '../../../../..'

import SvSearchSelected from '../sv-search-selected/sv-search-selected.vue'
import SvSearchContainer from '../sv-search-container/sv-search-container.vue'
import SvSearchItem from '../sv-search-item/sv-search-item.vue'

const SvForm = defineAsyncComponent(() => import('../../../../../molecules/sv-form/sv-form.vue'))

type Props = {
  modelValue: any
  propertyName: string
  parentCollection?: string
  searchOnly?: boolean

  property: CollectionProperty
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
  (e: 'changed'): void
}>()

provide('iconReactive', true)

const searchOnly = !props.property.s$inlineEditing || inject<boolean|null>('searchOnly', null)
const omitFormHeader = inject('omitFormHeader', false)

const parentStore = useParentStore(props.parentCollection)
const store = useStore(props.property.$ref!)

const indexes = parentStore.getIndexes({
  key: props.propertyName
})

const expanded = ref(false)
const edited = ref(parentStore.item[props.propertyName])
const matchingItems = ref<Array<Record<string, any> & { _id: string }>>([])

const isExpanded = computed(() => expanded.value || props.property.s$inline)

const rawItem = computed(() => {
  const item = parentStore.item[props.propertyName]
  const items = props.property.type === 'array'
    ? (Array.isArray(item) ? item : [item])
    : item

  return items
})

const isTyping = ref(false)
const inputValue = reactive({})

const insert = async () => {
  const result: any = await store.insert({ what: edited.value })

  const value = (() => {
    if( props.property.type === 'array' ) {
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
      [props.propertyName]: value
    }
  })

  emit('update:modelValue', parentResult[props.propertyName])
  matchingItems.value = []
  expanded.value = false
}

//const edit = (item: any) => {
//  const itemsCount = rawItem.value.length
//  edited.value = item
//  expanded.value = true
//}

const clear = () => {
  expanded.value = false
  matchingItems.value = []
  if( props.property.type === 'array' ) {
    rawItem.value = rawItem.value.slice(0, -1)
  }
}

const select = (item: any, itemIndex: number) => {
  const filterEmpties = (array: Array<any>) => array.filter(e => typeof e !== 'object' || Object.keys(e).length > 0)
  const modelValue = props.property.array
    ? filterEmpties(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue])
    : props.modelValue

  if( props.property.uniqueValues ) {
    matchingItems.value.splice(itemIndex, 1)
  }

  if( !props.property.array ) {
    matchingItems.value = []
  }

  emit('update:modelValue', props.property.array
    ? [ ...modelValue, item ]
    : item
  )

  emit('changed')
}

const pushBack = (item: any) => {
  matchingItems.value.push(item)
}

const addItem = () => {
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
  }))
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
