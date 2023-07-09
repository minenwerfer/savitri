<script setup lang="ts">
import type { CollectionProperty, Condition } from '@semantic-api/types'
import type { FormFieldProps } from '../types'
import { onBeforeMount, computed, provide, inject } from 'vue'
import { useStore, useCondition } from '@savitri/web'

import SvIcon from '../../sv-icon/sv-icon.vue'
import SvButton from '../../sv-button/sv-button.vue'
import SvSelect from '../sv-select/sv-select.vue'
import SvInput from '../sv-input/sv-input.vue'

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

type Props = FormFieldProps<any> & {
  form?: Record<string, CollectionProperty>
  formData?: Record<string, any>
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
  focus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isReadOnly: false,
  searchony: false,
  strict: true,
  validationErrors: null,
  highlightRequired: true
})

const emit = defineEmits<{
  (e: 'update:formData' | 'input' | 'change', value: any): void
}>()

onBeforeMount(() => {
  if( !props.formData ) {
    emit('update:formData', {})
  }
})

const collectionName = !props.property
  ? props.collection || inject('storeId', null)
  : null

const store = collectionName
  ? useStore(collectionName.value||collectionName)
  : null

if( !collectionName && process.env.NODE_ENV !== 'production' ) {
  console.warn(
    `sv-form was used without providing storeId or specifying
    collection prop, some features may not work as intended`
  )
}

const form = computed<Props['form']>(() => props.property?.properties || props.form)

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
provide('inputBordered', inject('inputBordered', true))

const filterProperties = (condition: (f: any) => boolean): Array<[string, CollectionProperty]>|null => {
  if( !form.value ) {
    return
  }

  return Object.entries(form.value).reduce((a: Array<any>, [key, property]) => {
    if(
      !(property
        && (!property.s$meta || props.searchOnly)
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
}


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

  if( layout?.if && !props.searchOnly ) {
    const result = useCondition(
      props.formData,
      layout.if
    )

    if( !result.satisfied ) {
      props.formData[key] = store
        ? store.$freshItem[key]
        : ![undefined, null].includes(props.formData[key])
          ? props.formData[key].constructor()
          : null

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

<template>
  <form
    class="form"
    :style="`row-gap: ${omitFormHeader ? '.8rem' : '2rem'};`"
  >
    <header v-if="$slots.header && !omitFormHeader" class="form__header">
      <slot name="header"></slot>
    </header>
    <fieldset
      v-if="!isReadOnly"
      class="form__fieldset"
    >
      <slot></slot>
      <div
        v-for="([key, property], index) in properties"
        :key="`field-${index}`"
        :style="fieldStyle(key, property)"
        class="form__field"
      >
        <label v-if="
          (property.type !== 'boolean' || searchOnly)
            && !property.s$noLabel
            && !omitInputLabels
        ">
          <div :class="{
            'form__field-label': true,
            'form__field-required-hint':
              highlightRequired
                && !searchOnly
                && (store?.description.strict || store?.description.required?.includes(key))
          }">
            {{ property.description || $t(key) }}
          </div>
          <div
            v-if="property.s$hint"
            v-html="property.s$hint"
          ></div>
        </label>

        <slot
          v-if="$slots[`field-${key}`]"
          v-bind="{
            property,
            formData,
            key
          }"
          :name="`field-${key}`"
        ></slot>

        <component
          v-else-if="layout?.[key]?.component && propertyComponents[layout[key].component!.name]"
          :is="propertyComponents[layout[key].component!.name]"
          v-model="formData[key]"
          v-bind="{
            property,
            propertyName: key,
            ...layout[key].component!.props||{},
          }"

          @input="emit('input', key)"
          @change="emit('change', $event)"
        />

        <div
          v-else-if="['date', 'date-time'].includes(property.format!) && searchOnly"
          style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            column-gap: 1rem;
          "
          @input="emit('input', key)"
          @change="emit('change', $event)"
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

        <div v-else-if="property.type === 'boolean' && searchOnly">
          <sv-select
            v-bind="{
              property,
              propertyName: key
            }"
            boolean-ref
            :model-value="formData[key]"

            @change="emit('change', $event)"
            @update:model-value="(value) => {
              formData[key] = value == 'true'
                ? true : value == 'false'
                ? false : null
          }">
            <option value="true">{{ $t('yes') }}</option>
            <option value="false">{{ $t('no') }}</option>
          </sv-select>
        </div>

        <div
          v-else-if="
            property.type === 'array'
              && (!(property.s$isReference && !property.s$inline) || property.s$isFile)
          "
          style="display: grid; row-gap: .4rem"
        >
          <div
            v-for="(value, listIndex) in formData[key]"
            :key="`rep-${key}-${listIndex}`"
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
                  value: value,
                  formData: formData[key][listIndex],
                  propertyName: key,
                  parentCollection: collectionName,
                  columns: layout?.[key]?.optionsColumns
                    || layout?.$default?.optionsColumns,
                  ...(property.s$componentProps || {})
                }"

                @input="emit('input', key)"
                @change="emit('change', $event)"
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
              @click="if(!formData[key]) formData[key] = []; pushToArray(formData[key], property)"
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
              || layout?.$default?.optionsColumns,
            ...(property.s$componentProps || {}),
            formData: formData[key],
          }"

          v-focus="index === 0 && focus"
          :key="focus"

          @input="emit('input', key)"
          @change="emit('change', $event)"
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

<style scoped src="./sv-form.scss"></style>
