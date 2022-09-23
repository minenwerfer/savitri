<template>
  <form class="form">
    <fieldset
      v-if="!isReadOnly && Object.keys(fields).length > 0"
      class="form__fieldset"
    >
      <!-- form -->
      <div
        v-for="([key, field], index) in fields"
        :key="`field-${index}`"
        :style="fieldStyle(key, field)"

        class="form__field"
        @input="$emit('input', key)"
      >
        <label>
          <strong>
            {{ field.translate ? $t(field.label) : field.label }}
          </strong>
          <div>
            {{ field.description }}
          </div>
        </label>

        <!-- text -->
        <sv-input
          v-if="isTextType(field.type)"
          v-model="formData[key]"
          v-bind="{
            ...field,
            name: key,
            readOnly: field.readOnly && !searchOnly
          }"
        ></sv-input>

        <!-- checkbox, radio, boolean, select -->
        <div v-else-if="isSelectType(field.type)">
          <div v-if="field.type !== 'select'">
            <sv-options
              v-if="['checkbox', 'radio'].includes(field.type)"
              v-model="formData[key]"
              v-bind="{
                ...field,
                columns: layout?.[key]?.optionsColumns
                  || layout?.$default?.optionsColumns
              }"
            ></sv-options>

            <sv-switch
              v-else-if="field.type === 'boolean'"
              v-model="formData[key]"
              v-slot="{ label }"

              v-bind="field"
            >
              {{ label }}
            </sv-switch>
          </div>

          <sv-select
            v-else
            v-model="formData[key]"
            :values="field.values"
            style="width: 100%"
          >
            <option value="">{{ $t('none') }}</option>
            <option v-for="(option, oindex) in field.values" :value="option.value">
              {{ field.translate ? $t(option.label) : option.label }}
            </option>
          </sv-select>
        </div>

        <sv-file
          v-if="field.collection === 'file'"
          v-model="formData[key]"
        ></sv-file>

        <div v-if="store?.validationErrors[key]" class="form__validation-error">
          <span>{{ $t(`validation_error.${store.validationErrors[key].type}`) }}</span>
          <span v-if="store.validationErrors[key].detail">
            {{ $t(store.validationErrors[key].detail) }}
          </span>
        </div>
      </div>
    </fieldset>

    <div
      v-if="!isReadOnly && store && referencedFields.length > 0"
      class="form__search-grid"
    >
      <sv-search
        v-for="([childCollection, field], index) in referencedFields"
        :key="`collectionfield-${index}`"

        v-model="formData[childCollection]"
        v-bind="{
          field,
          collection,
          indexes: store.getIndexes({ key: childCollection }),
          propName: childCollection,
          itemIndex: itemIndex != -1 ? itemIndex: 0,
          activeOnly: 'active' in field.fields,
          searchOnly: !field.inlineEditing
        }"

        @changed="$emit('change')"
      ></sv-search>
    </div>

    <fieldset v-if="isReadOnly" class="form__fieldset">
      <sv-input
        v-for="([key, field], index) in allInOne"
        :key="`collection-${index}`"

        v-bind="{
          ...inputBind(field, key),
          value: store.formatValue({
            value: field.translate ? $t(props.formData[key]||'') : props.formData[key],
            key,
            field,
            form: true
          })
        }"

        :style="fieldStyle(key, field)"
        class="form__field"
      >
        {{ field.label }}
      </sv-input>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { defineAsyncComponent, provide, inject, reactive } from 'vue'
import { useStore } from '@savitri/web'
import {
  SvInput,
  SvOptions,
  SvSwitch,
  SvSelect

} from '../..'

import SvSearch from './_internals/components/sv-search/sv-search.vue'
const SvFile = defineAsyncComponent(() => import('../../molecules/sv-file/sv-file.vue'))

type LayoutConfig = {
  span: number
}

type Props = {
  form: Record<string, any>
  formData: Record<string, any>
  collection?: string
  isReadOnly?: boolean
  searchOnly?: boolean
  itemIndex?: number
  fieldIndex?: number
  layout?: Record<string, LayoutConfig>
  strict?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isReadOnly: false,
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

const collectionName = props.collection || inject('storeId', null)
const store = collectionName
  ? useStore(collectionName.value||collectionName)
  : null

if( !collectionName && process.env.NODE_ENV !== 'production' ) {
  console.warn(
    `sv-form was used without providing storeId or specifying
    collection prop, some features may not work as intended`
  )
}

provide('storeId', collectionName)
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
  if(
    props.searchOnly
    || !props.strict
    || !collectionName
  ) {
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

const referencedFields = filterFields(([key, f]: [string, any]) => {
  return typeof f.collection === 'string'
    && f.collection !== 'file'
    && has(key)
    && (!f.readOnly || props.searchOnly)
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


const allInOne = filterFields()
  .sort((a: any, b: any) => typeof a.collection === typeof b.collection ? 1 : -1)
  .map(([key, field]: [string, any]) => {
    return [key, {
    ...field,
  }]
})

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

const fieldStyle = (key:string, field: any) => {
  const style = []
  const layout = props.layout?.[key] || props.layout?.$default

  style.push(`
    --field-span: ${layout?.span || 6};
    grid-column: span var(--field-span) / span var(--field-span);
  `)

  if(
    isSelectType(field?.type)
    || field?.collection === 'file'
  ) {
    style.push('padding-bottom: .6rem;')
  }

  if( !layout ) {
    return style.join('')
  }

  if( layout.verticalSpacing ) {
    style.push(`
      --vertical-spacing: ${layout.verticalSpacing};
      padding: var(--vertical-spacing) 0;
    `)
  }

  return style.join('')
}

const inputBind = (field: any, key: string, value: any) => {
  if( !store ) {
    return props.formData[key]
  }

  return {
    ...field,
    readOnly: true,
    type: isTextType(field.type) ? field.type : 'text',
    value,
  }
}
</script>

<style scoped src="./sv-form.scss"></style>
