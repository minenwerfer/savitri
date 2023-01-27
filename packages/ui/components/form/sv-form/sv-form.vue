<template>
  <form
    class="form"
    :style="`row-gap: ${omitFormHeader ? '.8rem' : '2rem'};`"
  >
    <header v-if="$slots.header && !omitFormHeader" class="form__header">
      <slot name="header"></slot>
    </header>
    <fieldset
      v-if="!isReadOnly && Object.keys(properties).length > 0"
      class="form__fieldset"
    >
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
          <strong :class="{
            'form__field-required-hint':
              highlightRequired
                && !searchOnly
                && (store?.description.strict || store?.description.required?.includes(key))
          }">
            {{
              property.s$translate
                ? $t(property.description || key)
                : property.description || key
            }}
          </strong>
          <div
            v-if="property.s$hint"
            v-html="property.s$hint"
            class="form__field-hint"
          ></div>
        </label>

        <component
          v-if="layout?.[key]?.component && propertyComponents[layout[key].component!.name]"
          :is="propertyComponents[layout[key].component!.name]"
          v-model="formData[key]"
          v-bind="{
            property,
            propertyName: key,
            ...layout[key].component!.props||{},
          }"
        />

        <div
          v-else-if="['date', 'date-time'].includes(property.format!) && searchOnly"
          style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            column-gap: 1rem;
          "
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

        <div
          v-else-if="
            property.type === 'array'
              && (!(property.s$isReference && !property.s$inline) || property.s$isFile)
          "
          style="display: grid; row-gap: .4rem"
        >
          <div
            v-for="(_, listIndex) in formData[key]"
            :key="`rep-${key}${_}-${listIndex}`"
            style="display: flex; column-gap: .6rem; align-items: center"
          >
            <div style="flex-grow: 1">
              <component
                :is="getComponent(property, formComponents)"
                v-model="formData[key][listIndex]"
                v-bind="{
                  property: {
                    ...property,
                    ...property.items
                  },
                  value: _,
                  propertyName: key,
                  parentCollection: collectionName,
                  columns: layout?.[key]?.optionsColumns
                    || layout?.$default?.optionsColumns
                }"
              ></component>
            </div>

            <sv-icon
              v-clickable
              reactive
              name="trash"
              @click="spliceFromArray(formData[key], listIndex)"
            ></sv-icon>
          </div>

          <div>
            <sv-button
              small
              variant="alt"
              icon="plus"
              :disabled="
                formData[key]?.length >= property.maxItems!
                  || unfilled(formData[key]?.[formData[key]?.length-1])
                  || (
                    property.s$isFile
                      && formData[key]?.length > 0
                      && !formData[key]?.[formData[key]?.length-1]?._id
                  )
              "
              @clicked="pushToArray(formData[key], property)"
            >
              Adicionar
            </sv-button>
          </div>
        </div>

        <pre v-else-if="property.type === 'object'">{{
          formData[key]
        }}</pre>

        <component
          v-else
          :is="getComponent(property, formComponents)"
          v-model="formData[key]"
          v-bind="{
            property,
            propertyName: key,
            parentCollection: collectionName,
            columns: layout?.[key]?.optionsColumns
              || layout?.$default?.optionsColumns
          }"
        ></component>

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
import { computed, provide, inject } from 'vue'
import type { CollectionProperty } from '@semantic-api/types'
import { useStore, useCondition, Condition } from '../../../../web'
import { SvInput, SvIcon, SvButton } from '../..'

import { getComponent, pushToArray, spliceFromArray } from './_internals/helpers'

type LayoutConfig = {
  span?: string
  verticalSpacing?: string
  optionsColumns?: number
  if?: Condition
  component?: {
    name: string
    props?: object
  }
}

type Props = {
  form: Record<string, CollectionProperty>
  formData: Record<string, any>
  collection?: string
  isReadOnly?: boolean
  searchOnly?: boolean
  layout?: Record<string, LayoutConfig>
  strict?: boolean
  formComponents?: Record<string, any>
  propertyComponents?: Record<string, any>
  omitFormHeader?: boolean
  omitInputLabels?: boolean
  validationErrors?: Record<string, any>|null
  highlightRequired?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isReadOnly: false,
  searchony: false,
  strict: true,
  validationErrors: null,
  highlightRequired: true
})

const emit = defineEmits<{
  (e: 'update:formData' | 'input', value: any): void
  (e: 'change'): void
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

const passAhead = <T extends keyof Props, P extends Props[T]>(propName: T): P => {
  const value = inject<P>(propName, props[propName] as P)
  if( props[propName] ) {
    provide(propName, props[propName])
  }

  return value
}

const validationErrors = computed(() => props.validationErrors !== null
  ? props.validationErrors
  : store?.validationErrors)

const formComponents = passAhead('formComponents')||{}
const propertyComponents = passAhead('propertyComponents')||{}
const omitFormHeader = passAhead('omitFormHeader')
const omitInputLabels = passAhead('omitInputLabels')

provide('storeId', collectionName)
provide('searchOnly', props.searchOnly||false)

const filterProperties = (condition: (f: any) => boolean): Array<[string, CollectionProperty]> => 
  Object.entries(props.form).reduce((a: Array<any>, [key, property]) => {
    if(
      !(property
        && (!(property.s$noForm  || property.s$meta) || props.searchOnly)
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

const unfilled = (value: any) => {
  return value === null
    || (value instanceof Object && !Object.keys(value).length)
}
</script>

<style scoped src="./sv-form.scss"></style>
