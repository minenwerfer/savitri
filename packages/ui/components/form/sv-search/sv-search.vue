<script setup lang="ts">
import {
  onMounted,
  provide,
  inject,
  computed,
  ref,
  reactive,

} from 'vue'

import type { CollectionProperty } from '@semantic-api/types'
import { useStore, useDebounce } from '@savitri/web'
import SvIcon from '../../sv-icon/sv-icon.vue'
import SvForm from '../sv-form/sv-form.vue'

import SvSearchSelected from './_internals/components/sv-search-selected/sv-search-selected.vue'
import SvSearchItem from './_internals/components/sv-search-item/sv-search-item.vue'

type Props = {
  modelValue: any
  property: CollectionProperty & NonNullable<{
    s$isReference: CollectionProperty['s$isReference']
    s$referencedCollection: CollectionProperty['s$referencedCollection']
  }>
  propertyName?: string
  parentCollection?: string
  searchOnly?: boolean
}

const props = defineProps<Props>()
const property = props.property

const emit = defineEmits<{
  (e: 'update:modelValue' | 'change', event: any): void
}>()

provide('storeId', property.s$referencedCollection!)
provide('innerInputLabel', true)
provide('omitInputLabels', true)

const searchOnly = !property.s$inlineEditing || inject<boolean|null>('searchOnly', null)
const omitFormHeader = inject('omitFormHeader', false)

const store = useStore(property.s$referencedCollection!)
const indexes = props.property.s$indexes

const expanded = ref(false)

const searchResponse = ref<any>({
  result: []
})

const matchingItems = computed<Array<Record<string, any> & { _id: string }>>(() => searchResponse.value.result || [])
const pagination = computed(() => searchResponse.value.pagination)

const isExpanded = computed(() => expanded.value || property.s$inline)

const isTyping = ref(false)
const inputValue = reactive<Record<string, any>>({})

const select = (item: any, itemIndex: number) => {
  const filterEmpties = (array: Array<any>) => array.filter(e => typeof e !== 'object' || Object.keys(e||{}).length > 0)
  const modelValue = property.type === 'array'
    ? filterEmpties(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue])
    : props.modelValue

  if( property.uniqueItems || (property.type === 'array' && searchOnly) ) {
    matchingItems.value.splice(itemIndex, 1)
  }

  emit('update:modelValue', property.type === 'array'
    ? [ ...modelValue, item ]
    : item
  )

  emit('change', item)
}

const pushBack = (item: any) => {
  searchResponse.value.result.push(item)
}

const search = async () => {
  if( Object.values(inputValue).every((v) => !(String(v).length > 0)) ) {
    searchResponse.value = property.s$prefetch
      ? await store.custom('getAll', {}, { fullResponse: true })
      : []

    return
  }

  if( store.loading.getAll ) {
    return
  }

  searchResponse.value = await store.custom('getAll', {
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
  }, { fullResponse: true })
}

onMounted(async () => {
  if( property.s$prefetch ) {
    searchResponse.value = await store.custom('getAll', {}, { fullResponse: true })
  }
})

const debounce = useDebounce({
  delay: 800,
})

const [doLazySearch] = debounce(() => {
  search()
  isTyping.value = false
})

const lazySearch = () => {
  isTyping.value = true
  doLazySearch()
}
</script>

<template>
  <div class="search">
    <sv-form
      v-if="isExpanded"
      v-bind="{
        collection: property.$ref,
        form: property.s$form
          ? store.useProperties(property.s$form)
          : store.properties,
        formData: modelValue,
        layout: store.formLayout
      }"
    ></sv-form>

    <sv-form
      v-else
      v-bind="{
        collection: property.$ref,
        form: store.useProperties(indexes),
        formData: inputValue,
        layout: store.formLayout,
        searchOnly: true
      }"
      @input="lazySearch"
    ></sv-form>

    <div
      v-if="!isExpanded"
      class="
        search__container
        search__container--selected
      "
    >
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
    </div>

    <div v-if="!isExpanded">
      <div
        v-if="matchingItems.length"
        class="
          search__container
          search__container--results
        "
      >
        <sv-search-item
          v-for="(item, index) in matchingItems"
          v-bind="{
            item,
            indexes
          }"

          :key="`matching-${item._id}`"
          @click="select(item, +index)"
        >
          <sv-icon name="plus"></sv-icon>
        </sv-search-item>

        <div v-if="pagination.recordsTotal > pagination.recordsCount">
          +{{ pagination.recordsTotal - pagination.recordsCount }} resultados
        </div>
      </div>

      <div v-else>
        <div v-if="isTyping">
          Pesquisando...
        </div>
        <div v-else-if="
          !store.loading.getAll
            && Object.values(inputValue).filter((v) => !!v).length > 0
            && !((property.type === 'array' && modelValue?.length) || modelValue?._id)
        ">
          Não há resultados
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./sv-search.scss"></style>
