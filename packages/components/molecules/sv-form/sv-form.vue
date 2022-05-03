<template>
  <div v-if="formData" class="flex flex-col gap-y-8 w-full">
    <div :class="`grid ${(!isSmall && flex) && 'md:grid-cols-3 items-end'} gap-4 w-full`" v-if="!isReadonly">
      <!-- form -->
      <div
        v-for="([key, field], index) in fields"
        :key="`field-${index}`"
        :class="(field.type === 'textbox' || field.flexGrow) && 'md:col-span-3'"
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
        <div v-else-if="['checkbox', 'radio', 'boolean', 'select'].includes(field.type)">
          <strong class="text-xs uppercase">{{ field.translate ? $t(field.label) : field.label }}</strong>
          <div class="text-sm opacity-50">
            {{ field.description }}
          </div>

          <div v-if="field.type !== 'select'" :class="flex || 'grid md:grid-cols-2 gap-1'">
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

        <div v-if="field.module === 'file'">
          <strong class="text-xs uppercase">{{ field.label }}</strong>
          <sv-file v-model="formData[key]" :context="`${module}.${itemIndex}.${key}.${fieldIndex}`"></sv-file>
        </div>

        <sv-input
          v-else-if="field.module"
          v-bind="{
            ...field,
            readonly: true,
            type: isTextType(field.type) ? field.type : 'text',
            value: formatValue(field.translate ? $t(formData[key]||'') : formData[key], key, true, field)
          }"
        >
          {{ field.label }}
        </sv-input>
      </div>
    </div>

    <div :class="`grid ${flex && 'md:flex'} gap-x-2 gap-y-4`" v-if="!isReadonly && moduleFields.length > 0">
      <sv-search
        v-for="([childModule, field], index) in moduleFields"
        :key="`modulefield-${index}`"

        v-model="formData[childModule]"
        v-bind="{
          field,
          indexes: getIndexes(childModule),
          propName: childModule,
          itemIndex: itemIndex != -1 ? itemIndex: 0,
          activeOnly: 'active' in field.fields
        }"

        @changed="$emit('change')"
        >
      </sv-search>
    </div>

    <div v-if="isReadonly" :class="`grid ${(!isSmall && flex) && 'md:grid-cols-3 items-end'} gap-4 w-full`">
      <sv-input
        v-for="([key, field], index) in allInOne"
        :key="`module-${index}`"

        v-bind="{
          ...field,
          readonly: true,
          type: isTextType(field.type) ? field.type : 'text',
          value: formatValue(field.translate ? $t(formData[key]||'') : formData[key], key, true, field)
        }"

        :class="(field.type === 'textbox' || field.flexGrow) && 'md:col-span-3'"
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
  toRefs,
  reactive,
  watch,

} from 'vue'

import { useStore } from 'vuex'
import { useModule } from '../../../frontend'
import { SvInput, SvCheckbox, SvSelect } from '../..'

const SvSearch = defineAsyncComponent(() => import('../../molecules/sv-search/sv-search.vue'))
const SvFile = defineAsyncComponent(() => import('../../molecules/sv-file/sv-file.vue'))

const props = defineProps({
  form: {
    type: Object,
    required: true,
    validator: (v: any) => Object.values(v).every((v: any) => !!v.type || !!v.module)
  },
  formData: {
    type: Object,
    required: true,
  },
  module: {
    type: String,
    required: false
  },
  // HTML5 has a DOM property with the same name
  isReadonly: {
    type: Boolean,
    default: false,
  },
  searchOnly: {
    type: Boolean,
    default: false,
  },
  flex: {
    type: Boolean,
    default: false
  },
  strict: {
    type: Boolean,
    default: true
  },
  itemIndex: {
    type: Number,
    default: 0
  },
  fieldIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits<{
  (e: 'update:formData', value: any): void
}>()

const store = useStore()
const module = ref<string>(inject('module', props.module))

const moduleRefs = reactive<any>({})
watch(module, () => Object.assign(moduleRefs as any, useModule(module.value, store)), { immediate: true })

provide('searchOnly', props.searchOnly||false)

const filterFields = (condition: (f: any) => boolean) => 
  Object.entries(props.form)
    .filter(([, field]: [unknown, any]) => field && (!field.noform || props.searchOnly))
    .filter((pair) => !condition || condition(pair))
    .map(([key, field]: [string, any]) => [key, {
      ...field,
      hidden: undefined,
    }])

const has = (field: string) => {
  if( props.searchOnly || !module ) {
    return true
  }

  const formFields = moduleRefs.description?.form
  return !formFields || formFields.includes(field)
}

const fields = filterFields(([key, f]: [string, any]) => {
  return !f.meta && has(key) &&
    (!(typeof f.module === 'string' && !f.readonly) || f.module === 'file')
})

const moduleFields = filterFields(([key, f]: [string, any]) => {
  return typeof f.module === 'string'
    && f.module !== 'file'
    && !f.readonly
    && has(key)
})
  .map(([key, value]: [string, any]) => [key, {
    ...value,
    ...store.getters[`${value.module}/description`]
  }])
  .filter(([, value]: [unknown, any]) => value.fields)


const allInOne = filterFields()
  .sort((a: any, b: any) => typeof a.module === typeof b.module ? 1 : -1)
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

const {
  getIndexes,
  formatValue

} = toRefs(moduleRefs)
</script>
