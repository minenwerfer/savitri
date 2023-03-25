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
    >
      <template #header v-if="!omitFormHeader">
        {{ $t(property.$ref||'') }}
      </template>
    </sv-form>

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
    >
      <template #header v-if="!omitFormHeader">
        {{ $t(property.$ref||'') }}
      </template>
    </sv-form>

    <sv-search-selected
      v-if="!isExpanded"
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
      <sv-search-container v-if="matchingItems.length">
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
</template>

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
import SvSearchContainer from './_internals/components/sv-search-container/sv-search-container.vue'
import SvSearchItem from './_internals/components/sv-search-item/sv-search-item.vue'

type Props = {
  modelValue: any
  property: CollectionProperty
  propertyName?: string
  parentCollection?: string
  searchOnly?: boolean
}

const props = defineProps<Props>()
const property = props.property

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
  (e: 'changed'): void
}>()

provide('storeId', property.s$referencedCollection!)

const searchOnly = !property.s$inlineEditing || inject<boolean|null>('searchOnly', null)
const omitFormHeader = inject('omitFormHeader', false)

const store = useStore(property.s$referencedCollection!)
const indexes = props.property.s$indexes

const expanded = ref(false)
const matchingItems = ref<Array<Record<string, any> & { _id: string }>>([])
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

  emit('changed')
}

const pushBack = (item: any) => {
  matchingItems.value.push(item)
}

const search = async () => {
  if( Object.values(inputValue).every((v) => !(String(v).length > 0)) ) {
    matchingItems.value = property.s$prefetch
      ? await store.custom('getAll')
      : []

    return
  }

  if( store.isLoading ) {
    return
  }

  matchingItems.value = await store.custom('getAll', {
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
  })
}

onMounted(async () => {
  if( property.s$prefetch ) {
    matchingItems.value = await store.custom('getAll')
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

<style scoped src="./sv-search.scss"></style>
