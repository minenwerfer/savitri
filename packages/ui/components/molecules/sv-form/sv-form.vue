<template>
  <form
    class="form"
    :style="`row-gap: ${omitFormHeader ? '.8rem' : '2rem'};`"
  >
    <header v-if="$slots.header" class="form__header">
      <slot name="header"></slot>
    </header>
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
        @input="emit('input', key)"
      >
        <label v-if="
          field.type !== 'boolean'
            && (!field.collection || field.collection === 'file')
            && !omitInputLabels
        ">
          <strong>
            {{ field.translate ? $t(field.label) : field.label }}
          </strong>
          <div
            v-if="field.description"
            v-html="field.description"
          ></div>
        </label>

        <component
          v-if="layout?.[key]?.component && formComponents[layout[key].component?.name]"
          :is="formComponents[layout[key].component.name]"
          v-model="formData[key]"
          v-bind="{
            field,
            fieldName: key,
            ...layout[key].component.props||{},
          }"
        />

        <!-- text -->
        <sv-input
          v-else-if="isTextType(field.type)"
          v-model="formData[key]"
          v-bind="{
            field,
            fieldName: key,
            readOnly: field.readOnly && !searchOnly,
            placeholder: field.placeholder || (field.translate ? $t(field.label) : field.label)
          }"
        ></sv-input>

        <sv-options
          v-else-if="['checkbox', 'radio'].includes(field.type)"
          v-model="formData[key]"
          v-bind="{
            field,
            columns: layout?.[key]?.optionsColumns
              || layout?.$default?.optionsColumns
          }"
        ></sv-options>

        <sv-switch
          v-else-if="field.type === 'boolean'"
          v-model="formData[key]"
          v-slot="{ label }"

          v-bind="{
            field
          }"
        >
          {{
            field.values
              ? label
              : field.label
          }}
        </sv-switch>

        <sv-select
          v-else-if="field.type === 'select'"
          v-model="formData[key]"
          v-bind="{
            field
          }"
          style="width: 100%"
        ></sv-select>

        <sv-file
          v-else-if="field.collection === 'file'"
          v-model="formData[key]"
        ></sv-file>

        <sv-search
          v-else-if="field.collection"
          :key="`collectionfield-${index}`"

          v-model="formData[key]"
          v-bind="{
            field,
            fieldName: key,
            parentCollection: collection
          }"

          :style="fieldStyle(key, field)"
          @changed="emit('change')"
        ></sv-search>


        <div v-if="store?.validationErrors[key]" class="form__validation-error">
          <span v-if="store.validationErrors[key].type">
            {{ $t(`validation_error.${store.validationErrors[key].type}`) }}
          </span>
          <span v-if="store.validationErrors[key].detail">
            {{ $t(store.validationErrors[key].detail) }}
          </span>
        </div>
      </div>
    </fieldset>

    <!-- <fieldset v-if="isReadOnly" class="form__fieldset"> -->
    <!--   <sv-input -->
    <!--     v-for="([key, field], index) in fields" -->
    <!--     :key="`collection-${index}`" -->

    <!--     v-bind="{ -->
    <!--       ...inputBind(field, key), -->
    <!--       value: store.formatValue({ -->
    <!--         value: field.translate ? $t(props.formData[key]||'') : props.formData[key], -->
    <!--         key, -->
    <!--         field, -->
    <!--         form: true -->
    <!--       }) -->
    <!--     }" -->

    <!--     :style="fieldStyle(key, field)" -->
    <!--     class="form__field" -->
    <!--   > -->
    <!--     {{ field.label }} -->
    <!--   </sv-input> -->
    <!-- </fieldset> -->

    <div v-if="$slots.footer" class="form__footer">
      <slot name="footer"></slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  provide,
  inject,
  reactive

} from 'vue'

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
  fieldIndex?: number
  layout?: Record<string, LayoutConfig>
  strict?: boolean
  formComponents?: any
  omitFormHeader?: boolean
  omitInputLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isReadOnly: false,
  searchony: false,
  strict: true,
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

const passAhead = (propName: string) => {
  const value = inject(propName, props[propName])
  if( props[propName] ) {
    provide(propName, props[propName])
  }

  return value
}

const formComponents = passAhead('formComponents')
const omitFormHeader = passAhead('omitFormHeader')
const omitInputLabels = passAhead('omitInputLabels')

provide('storeId', collectionName)
provide('searchOnly', props.searchOnly||false)

const filterFields = (condition: (f: any) => boolean) => 
  Object.entries(props.form)
    .reduce((a: Array<any>, [key, field]: [string, any]) => {
      if(
        !(field
          && (!field.noform || props.searchOnly)
          && (!condition || condition([key, field]))
      )) {
        return a
      }

      return [
        ...a,
        [
          key,
          {
            ...field,
            hidden: undefined
          }
        ]
      ]
    }, [])


const has = (fieldName: string) => {
  if(
    props.searchOnly
    || !props.strict
    || !collectionName
  ) {
    return true
  }

  const formFields = store.description?.form
  return !formFields || formFields.includes(fieldName)
}

const fields = filterFields(([key, f]: [string, any]) => {
  return (!f.readOnly || props.searchOnly)
    && !f.meta
    && has(key)
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

  if( !field ) {
    return
  }

  if( layout?.if ) {
    const term1 = props.formData[layout.if.term1]
    const term2 = layout.if.term2

    const result = (() => {switch( layout.if.operator ) {
      case 'equal': return term1 === term2
      case 'unequal': return term1 !== term2
      case 'in': return term2.includes(term1)
    }})()

    if( !result ) {
      props.formData[key] = undefined
      style.push(`display: none;`)
    }
  }

  style.push(`
    --field-span: ${layout?.span || 6};
    grid-column: span var(--field-span) / span var(--field-span);
  `)

  if(
    isSelectType(field.type)
    && field.type !== 'boolean'
    || field.collection === 'file'
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
