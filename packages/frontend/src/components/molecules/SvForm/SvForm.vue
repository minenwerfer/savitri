<template>
  <div v-if="formData">
    <div :class="`grid gap-y-${gapY} pt-${paddingTop} pb-${paddingBottom}`" v-if="!isReadonly">
      <!-- form -->
      <div
        v-for="([key, field], index) in fields"
        :key="`field-${index}`"
      >
        <!-- text -->
        <sv-input v-if="['text', 'password', 'number'].includes(field.type)" :type="field.type" :placeholder="field.placeholder" :mask="field.mask" v-model="formData[key]">
          <template #label>{{ field.label }}</template>
          <template #description v-if="field.description">{{ field.description }}</template>
        </sv-input>

        <!-- textbox, checkbox, radio, boolean, select -->
        <div v-else-if="['textbox', 'checkbox', 'radio', 'boolean', 'select'].includes(field.type)">
          <header v-if="field.type !== 'boolean'">{{ field.label }}</header>
          <div class="text-sm opacity-50">
            {{ field.description }}
          </div>

          <sv-textbox v-if="field.type === 'textbox'" v-model="formData[key]"></sv-textbox>

          <div v-else-if="field.type !== 'select'" class="grid grid-cols-2 gap-1">
            <sv-checkbox v-if="['checkbox', 'radio'].includes(field.type)" v-for="(value, vindex) in field.values" :key="`value-${vindex}`" v-model="formData[key]" :array="true" :value="value.value" :is-radio="field.type === 'radio'">
              <template #label>{{ field.translate ? $t(value.label) : value.label }}</template>
              <template #description>{{ value.description }}</template>
            </sv-checkbox>

            <sv-checkbox v-else-if="field.type === 'boolean'" v-model="formData[key]" :value="formData[key] === true">
              <template #label>{{ field.label }}</template>
            </sv-checkbox>
          </div>


          <sv-select v-else v-model="formData[key]">
            <option value="">
              {{ $t('none') }}
            </option>
            <option v-for="(option, oindex) in field.values" :value="option.value">
              {{ $t(option.label) }}
            </option>
          </sv-select>
        </div>

        <div v-if="field.module === 'file'">
          <header>{{ field.label }}</header>
          <sv-file v-model="formData[key]" :context="`${module}.${itemIndex}.${key}.${fieldIndex}`"></sv-file>
        </div>
      </div>
    </div>

    <div class="grid gap-y-2 mt-4" v-if="!isReadonly">
      <div v-for="([childModule, field], index) in moduleFields" :key="`modulefield-${index}`">

        <sv-search
          v-if="!isReadonly"
          v-model="formData[childModule]"
          :field="field"
          :field-name="getFirstField(field, childModule)"
          :prop-name="childModule" 
          :item-index="itemIndex"
          >
        </sv-search>
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
import { defineAsyncComponent, inject, ref, reactive, watch, } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { SvInput, SvTextbox, SvCheckbox, SvSelect } from 'frontend/components'

const SvSearch = defineAsyncComponent(() => import('frontend/components/molecules/SvSearch/SvSearch.vue'))
const SvFile = defineAsyncComponent(() => import('frontend/components/molecules/SvFile/SvFile.vue'))

const props = defineProps({
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
    value: moduleRefs.formatValue((props.formData||{})[key], key, true),
  }]
})

const getFirstField = ref(moduleRefs.getFirstField)
</script>
