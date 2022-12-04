<template>
  <form
    class="form"
    :style="`row-gap: ${omitFormHeader ? '.8rem' : '2rem'};`"
  >
    <header v-if="$slots.header" class="form__header">
      <slot name="header"></slot>
    </header>
    <fieldset
      v-if="!isReadOnly && Object.keys(properties).length > 0"
      class="form__fieldset"
    >
      <!-- form -->
      <div
        v-for="([key, property], index) in properties"
        :key="`field-${index}`"
        :style="fieldStyle(key, property)"

        class="form__field"
        @input="emit('input', key)"
      >
        <label v-if="
          property.type !== 'boolean'
            && (!property.$ref || property.$ref === 'file')
            && !omitInputLabels
        ">
          <strong>
            {{ property.translate ? $t(property.description) : property.description }}
          </strong>
          <div
            v-if="property.s$hint"
            v-html="property.s$hint"
            class="form__field-hint"
          ></div>
        </label>

        <component
          v-if="layout?.[key]?.component && formComponents[layout[key].component?.name]"
          :is="formComponents[layout[key].component!.name]"
          v-model="formData[key]"
          v-bind="{
            property,
            propertyName: key,
            ...layout[key].component!.props||{},
          }"
        />

        <div
          v-else-if="property.type === 'datetime' && searchOnly"
          style="display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 1rem;"
        >
          <sv-input
            v-model="formData[key].$gte"
            v-bind="{
              property,
              propertyName: key
            }"
          ></sv-input>
          <sv-input
            v-model="formData[key].$lte"
            v-bind="{
              property,
              propertyName: key
            }"
          ></sv-input>
        </div>

        <sv-options
          v-else-if="['checkbox', 'radio'].includes(property.s$format)"
          v-model="formData[key]"
          v-bind="{
            property,
            columns: layout?.[key]?.optionsColumns
              || layout?.$default?.optionsColumns
          }"
        ></sv-options>

        <sv-select
          v-else-if="property.s$format === 'select'"
          v-model="formData[key]"
          v-bind="{
            property
          }"
          style="width: 100%"
        ></sv-select>

        <!-- text -->
        <sv-input
          v-else-if="property.type === 'string'"
          v-model="formData[key]"
          v-bind="{
            property,
            propertyName: key,
            placeholder: property.s$placeholder || property.s$translate ? $t(property.description||'') : property.description
          }"
        ></sv-input>

        <sv-switch
          v-else-if="property.type === 'boolean'"
          v-model="formData[key]"
          v-slot="{ label }"

          v-bind="{
            property
          }"
        >
          {{
            property.s$values
              ? label
              : property.description
          }}
        </sv-switch>

        <sv-file
          v-else-if="property.$ref === 'file'"
          v-model="formData[key]"
          v-bind="{
            property
          }"
        ></sv-file>

        <sv-search
          v-else-if="property.$ref"
          :key="`collectionfield-${index}`"

          v-model="formData[key]"
          v-bind="{
            property,
            propertyName: key,
            parentCollection: collection
          }"

          :style="fieldStyle(key, property)"
          @changed="emit('change')"
        ></sv-search>


        <div v-if="validationErrors?.[key]" class="form__validation-error">
          <span v-if="validationErrors[key].type">
            {{ $t(`validation_error.${validationErrors[key].type}`) }}
          </span>
          <span v-if="validationErrors[key].detail">
            {{ $t(validationErrors[key].detail) }}
          </span>
        </div>
      </div>
    </fieldset>

    <div v-if="$slots.footer" class="form__footer">
      <slot name="footer"></slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  computed,
  provide,
  inject,

} from 'vue'

import { useStore } from '../../../../web'
import {
  SvInput,
  SvOptions,
  SvSwitch,
  SvSelect

} from '../..'

import { useCondition, Condition } from '../../../composables'
import type { CollectionProperty } from '../../../../types'

import SvSearch from './_internals/components/sv-search/sv-search.vue'
const SvFile = defineAsyncComponent(() => import('../../molecules/sv-file/sv-file.vue'))

type LayoutConfig = {
  span?: string
  verticalSpacing?: string
  if?: Condition
  component?: {
    name: string
    props?: object
  }
}

type Props = {
  $ref?: string&{ value: string }
  form: Record<string, CollectionProperty>
  formData: Record<string, any>
  collection?: string
  isReadOnly?: boolean
  searchOnly?: boolean
  layout?: Record<string, LayoutConfig>
  strict?: boolean
  formComponents?: any
  omitFormHeader?: boolean
  omitInputLabels?: boolean
  validationErrors?: Record<string, any>|null
}

const props = withDefaults(defineProps<Props>(), {
  isReadOnly: false,
  searchony: false,
  strict: true,
  validationErrors: null
})

const emit = defineEmits<{
  (e: 'update:formData' | 'input', value: any): void
  (e: 'change'): void
}>()

const collectionName = props.$ref || inject('storeId', null)
const store = collectionName
  ? useStore(collectionName.value||collectionName)
  : null

if( !collectionName && process.env.NODE_ENV !== 'production' ) {
  console.warn(
    `sv-form was used without providing storeId or specifying
    collection prop, some features may not work as intended`
  )
}

const passAhead = (propName: keyof Props) => {
  const value = inject(propName, props[propName])
  if( props[propName] ) {
    provide(propName, props[propName])
  }

  return value
}

const validationErrors = computed(() => props.validationErrors !== null
  ? props.validationErrors
  : store?.validationErrors)

const formComponents = passAhead('formComponents')
const omitFormHeader = passAhead('omitFormHeader')
const omitInputLabels = passAhead('omitInputLabels')

provide('storeId', collectionName)
provide('searchOnly', props.searchOnly||false)

const filterProperties = (condition: (f: any) => boolean) => 
  Object.entries(props.form)
    .reduce((a: Array<any>, [key, property]: [string, any]) => {
      if(
        !(property
          && (!(property.s$noform  || property.s$meta) || props.searchOnly)
          && (!condition || condition([key, property]))
      )) {
        return a
      }

      return [
        ...a,
        [
          key,
          {
            ...property,
            hidden: undefined
          }
        ]
      ]
    }, [])


const has = (propertyName: string) => {
  if(
    props.searchOnly
    || !props.strict
    || !collectionName
  ) {
    return true
  }

  const formProperties = store.description?.form
  return !formProperties || formProperties.includes(propertyName)
}

const properties = filterProperties(([key, f]: [string, any]) => {
  return (!f.readOnly || props.searchOnly)
    && !f.meta
    && has(key)
})

const fieldStyle = (key:string, property: any) => {
  const style = []
  const layout = props.layout?.[key] || props.layout?.$default

  if( !property ) {
    return
  }

  if( layout?.if ) {
    const result = useCondition(
      props.formData,
      layout.if
    )

    if( !result.satisfied ) {
      props.formData[key] = undefined
      style.push(`display: none;`)
    }
  }

  style.push(`
    --field-span: ${layout?.span || 6};
    grid-column: span var(--field-span) / span var(--field-span);
  `)

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
</script>

<style scoped src="./sv-form.scss"></style>
