<template>
  <div v-if="formData">
    <div :class="`grid gap-y-${gapY} pt-${paddingTop} pb-${paddingBottom}`" v-if="!isReadonly">
      <!-- form -->
      <div
        v-for="([key, field], index) in fields"
        :key="`field-${index}`"
      >
        <!-- text -->
        <c-input v-if="['text', 'password', 'number'].includes(field.type)" :type="field.type" :placeholder="field.placeholder" :mask="field.mask" v-model="formData[key]">
          <template #label>{{ field.label }}</template>
          <template #description v-if="field.description">{{ field.description }}</template>
        </c-input>

        <!-- textbox, checkbox, radio, boolean, select -->
        <div v-else-if="['textbox', 'checkbox', 'radio', 'boolean', 'select'].includes(field.type)">
          <header v-if="field.type !== 'boolean'">{{ field.label }}</header>
          <div class="text-sm opacity-50">
            {{ field.description }}
          </div>

          <c-textbox v-if="field.type === 'textbox'" v-model="formData[key]"></c-textbox>

          <div v-else-if="field.type !== 'select'" class="grid grid-cols-2 gap-1">
            <c-checkbox v-if="['checkbox', 'radio'].includes(field.type)" v-for="(value, vindex) in field.values" :key="`value-${vindex}`" v-model="formData[key]" :array="true" :value="value.value" :is-radio="field.type === 'radio'">
              <template #label>{{ field.translate ? $t(value.label) : value.label }}</template>
              <template #description>{{ value.description }}</template>
            </c-checkbox>

            <c-checkbox v-else-if="field.type === 'boolean'" v-model="formData[key]" :value="formData[key] === true">
              <template #label>{{ field.label }}</template>
            </c-checkbox>
          </div>


          <c-select v-else v-model="formData[key]">
            <option value="">
              {{ $t('none') }}
            </option>
            <option v-for="(option, oindex) in field.values" :value="option.value">
              {{ $t(option.label) }}
            </option>
          </c-select>
        </div>

        <div v-if="field.module === 'file'">
          <header>{{ field.label }}</header>
          <c-file v-model="formData[key]" :context="`${module}.${key}`"></c-file>
        </div>
      </div>
    </div>

    <div class="grid gap-y-2 mt-4" v-if="!isReadonly">
      <div v-for="([childModule, field], index) in moduleFields" :key="`modulefield-${index}`">

        <c-search
          v-if="!isReadonly"
          v-model="formData[childModule]"
          :field="field"
          :field-name="getFirstField(field, childModule)"
          :prop-name="childModule" 
          >
        </c-search>
      </div>
    </div>

    <div v-if="isReadonly" class="grid gap-y-4 text-md">
      <div
        v-for="([, field], index) in allInOne"
        :key="`module-${index}`"
        class="grid grid-cols-2"
        >
        <strong>{{ field.label }}</strong>
        <div class="text-right sm:text-left">{{ field.formValue || field.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, inject, ref, reactive, watch, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { CInput, CTextbox, CCheckbox, CSelect, } from 'frontend/components'

const CSearch = defineAsyncComponent(() => import('frontend/components/molecules/CSearch/CSearch.vue'))
const CFile = defineAsyncComponent(() => import('frontend/components/molecules/CFile/CFile.vue'))

const props: {
  form: any
  formData: any
  isReadonly?: boolean
  gapY?: number
  paddingTop?: number
  paddingBottom?: number

} & any = defineProps({
  form: {
    type: Object,
    required: true,
    validator: (v: any) => Object.values(v).every((v: any) => !!v.label)
  },
  formData: {
    type: Object,
    required: true,
  },
  // HTML5 has a DOM property with the same name
  isReadonly: {
    type: Boolean,
    default: false,
  },
  gapY: {
    type: Number,
    default: 4
  },
  paddingTop: {
    type: Number,
    default: 2
  },
  paddingBottom: {
    type: Number,
    default: 2
  }
})

const store = useStore()
const module = ref<string>(inject('module', ''))

const moduleRefs = reactive<any>({})
watch(module, () => Object.assign(moduleRefs as any, useModule(module.value, store)), { immediate: true })

const filterFields = (condition: (f: any) => boolean) => 
  Object.entries(props.form)
    .filter(([, field]: [unknown, any]) => field && !field.meta && !field.noform)
    .filter(([, field]) => condition(field))

const fields = filterFields((f: any) => typeof f.module !== 'string' || f.module === 'file')
const moduleFields = filterFields((f: any) => typeof f.module === 'string' && f.module !== 'file')
  .map(([key, value]: [string, any]) => [key, {
    ...value,
    ...store.getters[`${value.module}/description`]
  }])


const allInOne = Object.entries(props.form)
  .sort((a: any, b: any) => typeof a.module === typeof b.module ? 1 : -1)
  .map(([key, field]: [string, any]) => {
    return [key, {
    label: field.label,
    value: moduleRefs.formatValue(props.formData[key], key, true),
  }]
})

const getFirstField = ref(moduleRefs.getFirstField)
</script>
