<template>
  <div :key="parent" @change.prevent.stop="" class="w-full mb-4">
    <header class="font-semibold mb-1">{{ moduleName }}</header>
    <div v-if="isExpanded" class="mb-2">
      <sv-form
        :form="moduleRefs.fields"
        :form-data="edited"
        :item-index="itemIndex"
        :field-index="fieldIndex"
      ></sv-form>
      <div v-if="!expand" class="text-sm">
        <sv-button @clicked="insert" class="justify-self-end mr-2">Salvar</sv-button>
        <sv-button @clicked="clear">Limpar</sv-button>
      </div>
    </div>

    <div v-else class="flex flex-wrap gap-x-4 gap-y-2">
      <div
        v-for="([indexName, searchField], index) in indexes.map((i) => [i, field.fields[i]])"
        :key="`searchField-${index}`"
        class="flex-grow"
      >
        <sv-input
          @input="lazySearch(indexName, inputValue[indexName])"
          v-model="inputValue[indexName]"
          v-if="!field.purge"
        >
            {{ searchField.label }}
        </sv-input>
        <sv-button class="self-end text-sm" v-if="array" @clicked="addItem">Adicionar</sv-button>
      </div>
    </div>

    <div v-if="!isExpanded || array" :key="inputValue" style="max-width: 20em">
      <div :class="`grid select-none ${isLoading ? 'opacity-30' : ''}`">
        <div v-for="(item, index) in items" :key="`item-${index}`" @click="select(item)">
          <div class="cursor-pointer p-2 border">{{ item[indexes[0]] }}</div>
        </div>
      </div>

      <div v-if="!searchOnly && selected.length > 0" class="mt-4">
        <div v-for="(item, index) in selected" :key="`item-${index}`" class="flex gap-x-2 px-2 py-1 border">
          <div class="flex-1">{{ item[indexes[0]] }}</div>
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
import { provide, inject, computed, ref, reactive, defineAsyncComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { SvInput, SvButton, SvBareButton } from 'frontend/components'
import useModule from 'frontend/composables/module'

const SvForm = defineAsyncComponent(() => import('frontend/components/molecules/SvForm/SvForm.vue'))

const props = defineProps<{
  modelValue: any
  propName: string
  field: any
  itemIndex?: number
  indexes: any
  activeOnly: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', event: any): void
  (e: 'changed'): void
}>()

const store = useStore()
const _parentModule = inject<{ value: string }>('module', { value: '' })
const parentModule = _parentModule.value || _parentModule

const searchOnly = inject<boolean>('searchOnly', false)

const parentRefs = useModule(parentModule, store)
const moduleRefs = reactive(useModule(props.field.module, store))

const field = props.field
provide('module', field.module)

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

const search = () => {
  if( Object.values(inputValue).some((v: string) => v.length === 0) ) {
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
  window.clearTimeout(window.__lazySearchTimeout)
  window.__lazySearchTimeout = setTimeout(() => {
    search()
  }, 800)
}
</script>
