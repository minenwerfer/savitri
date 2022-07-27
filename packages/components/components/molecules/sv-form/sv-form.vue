<template>
  <div v-if="!isReadonly" class="form">
    <fieldset
      v-if="!isReadonly && Object.keys(fields).length > 0"
      class="form__fieldset"
    >
      <!-- form -->
      <div
        v-for="([key, field], index) in fields"
        :key="`field-${index}`"
        :class="`form__field ${fieldClass(field)}`"
        :style="`
          --field-span: ${
            layout?.[key]?.span
              ? layout[key].span
              : field.formSpan || 6
          };
          grid-column: span var(--field-span) / span var(--field-span);
        `"

        @input="$emit('input', key)"
      >
        <!-- text -->
        <sv-input
          v-if="isTextType(field.type)"
          v-model="formData[key]"
          v-bind="{
            ...field,
            readonly: field.readonly && !searchOnly
          }"
        >
          <template #label>{{ field.label }}</template>
          <template #description v-if="field.description">{{ field.description }}</template>
        </sv-input>

        <!-- checkbox, radio, boolean, select -->
        <div v-else-if="isSelectType(field.type)">
          <strong class="text-xs uppercase">
            {{ field.translate ? $t(field.label) : field.label }}
          </strong>
          <div class="text-sm opacity-50">
            {{ field.description }}
          </div>

          <div v-if="field.type !== 'select'" class="form__options-grid">
            <sv-checkbox
              v-if="['checkbox', 'radio'].includes(field.type)"
              v-for="(value, vindex) in field.values"
              :key="`value-${vindex}`"

              v-model="formData[key]"
              v-bind="{
                array: true,
                value: value.value,
                label: field.translate ? $t(value.label) : value.label,
                description: value.description,
                isRadio: field.type === 'radio',
                readonly: field.readonly
              }"
            ></sv-checkbox>

            <sv-checkbox
              v-else-if="field.type === 'boolean'"
              v-model="formData[key]"

              v-bind="{
                value: formData[key] == true,
                readonly: field.readonly,
                label: field.label
              }"
            ></sv-checkbox>
          </div>

          <sv-select v-else v-model="formData[key]" :values="field.values" class="py-2">
            <option value="">{{ $t('none') }}</option>
            <option v-for="(option, oindex) in field.values" :value="option.value">
              {{ field.translate ? $t(option.label) : option.label }}
            </option>
          </sv-select>
        </div>

        <div v-if="field.collection === 'file'">
          <strong class="text-xs uppercase">{{ field.label }}</strong>
          <sv-file v-model="formData[key]" :context="`${collection}.${itemIndex}.${key}.${fieldIndex}`"></sv-file>
        </div>

        <sv-input
          v-else-if="field.collection"
          v-bind="{
            ...field,
            readonly: true,
            type: isTextType(field.type) ? field.type : 'text',
            value: store.formatValue(field.translate ? $t(formData[key]||'') : formData[key], key, true, field)
          }"
        >
          {{ field.label }}
        </sv-input>
      </div>
    </fieldset>

    <div class="form__search-grid" v-if="!isReadonly && collectionFields.length > 0">
      <sv-search
        v-for="([childCollection, field], index) in collectionFields"
        :key="`collectionfield-${index}`"

        v-model="formData[childCollection]"
        v-bind="{
          field,
          collection,
          indexes: store.getIndexes({ key: childCollection }),
          propName: childCollection,
          itemIndex: itemIndex != -1 ? itemIndex: 0,
          activeOnly: 'active' in field.fields
        }"

        @changed="$emit('change')"
      ></sv-search>
    </div>

    <div v-if="isReadonly" :class="`grid grid-cols-6 gap-4 w-full`">
      <sv-input
        v-for="([key, field], index) in allInOne"
        :key="`collection-${index}`"

        v-bind="{
          ...field,
          readonly: true,
          type: isTextType(field.type) ? field.type : 'text',
          value: store.formatValue(field.translate ? $t(formData[key]||'') : formData[key], key, true, field)
        }"

        :class="fieldClass(field)"
      >
        {{ field.label }}
      </sv-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  provide,
  inject,
  computed,
  ref,
  reactive,
  watch,

} from 'vue'

import { useStore, useParentStore } from '@savitri/web'
import { SvInput, SvCheckbox, SvSelect } from '../..'

const SvSearch = defineAsyncComponent(() => import('../../molecules/sv-search/sv-search.vue'))
const SvFile = defineAsyncComponent(() => import('../../molecules/sv-file/sv-file.vue'))

type LayoutConfig = {
  span: number
}

interface Props {
  form: Record<string, any>
  formData: Record<string, any>
  collection?: string
  isReadonly?: boolean
  searchOnly?: boolean
  itemIndex?: number
  fieldIndex?: number
  layout?: Record<string, LayoutConfig>

  // currently unused!
  strict?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isReadonly: false,
  searchony: false,
  strict: true,
  itemIndex: 0,
  fieldIndex: 0
})

const emit = defineEmits<{
  (e: 'update:formData', value: any): void
  (e: 'input', value: string): void
  (e: 'change', value: string): void
}>()

const store = reactive({})
const collection = ref<string>(props.collection || inject('storeId'))

watch(
  () => collection,
  (collectionName: string) => Object.assign(store, useStore(collectionName.value)),
  { immediate: true }
)

provide('searchOnly', props.searchOnly||false)

const filterFields = (condition: (f: any) => boolean) => 
  Object.entries(props.form)
    .filter(([key, field]: [string, any]) => (
      field
        && (!field.noform || props.searchOnly)
        && (!condition || condition([key, field]))
    ))
    .map(([key, field]: [string, any]) => [key, {
      ...field,
      hidden: undefined,
    }])

const has = (field: string) => {
  if( props.searchOnly || !collection ) {
    return true
  }

  const formFields = store.description?.form
  return !formFields || formFields.includes(field)
}

const fields = filterFields(([key, f]: [string, any]) => {
  return (!(typeof f.collection === 'string' && (!f.readOnly || props.searchOnly)) || f.collection === 'file')
    && !f.meta
    && has(key)
})

const collectionFields = filterFields(([key, f]: [string, any]) => {
  return typeof f.collection === 'string'
    && f.collection !== 'file'
    && has(key)
    && (!f.readonly || props.searchOnly)
})
  .map(([key, value]: [string, any]) => {
    const store = useStore(value.collection)
    return [
      key, {
        ...value,
        ...store.description
      }
    ]
  })
  .filter(([, value]: [unknown, any]) => value.fields)


const allInOne = filterFields()
  .sort((a: any, b: any) => typeof a.collection === typeof b.collection ? 1 : -1)
  .map(([key, field]: [string, any]) => {
    return [key, {
    ...field,
  }]
})

const isSmall = computed(() => Object.keys(allInOne).length < 6)

const isTextType = (type: string) => {
  return [
    'text',
    'textbox',
    'password',
    'number',
    'integer',
    'datetime'
  ].includes(type)
}

const isSelectType = (type: string) => {
  return [
    'checkbox',
    'radio',
    'boolean',
    'select'
  ].includes(type)
}

const fieldClass = (field: any) => {
  if( field.formStyle ) {
    return field.formStyle
  }

  /*
  if( isSelectType(field.type)
    || field.type === 'textbox'
    || field.collection === 'file' ) {
    return 'col-span-6'
  }
  */

  return ''
}
</script>

<style scoped src="./sv-form.scss"></style>
