<template>
  <div v-if="formData">
    <div :class="`grid gap-y-${gapY} pt-${paddingTop} pb-${paddingBottom}`" v-if="!isReadonly">
      <!-- form -->
      <div
        v-for="([key, field], index) in fields"
        :key="`field-${index}`"
      >

      <c-input v-if="['text', 'password', 'number'].includes(field.type)" :type="field.type" :placeholder="field.placeholder" :mask="field.mask" v-model="formData[key]">
        <template #label>{{ field.label }}</template>
        <template #description v-if="field.description">{{ field.description }}</template>
      </c-input>

      <!-- textbox, checkbox, radio, boolean, select -->
      <div v-else-if="['textbox', 'checkbox', 'radio', 'boolean', 'select'].includes(field.type)">
        <header>{{ field.label }}</header>
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

      </div>
    </div>

    <div class="grid gap-y-2 mt-4" v-if="!isReadonly">
      <div v-for="([childModule, field], index) in moduleFields" :key="`modulefield-${index}`">
        <c-search
          v-if="!isReadonly"
          v-model="formData[childModule]"

          :prop-name="childModule" 
          :module="field.module" :module-name="field.label?.capitalize()"

          :expand="field.expand === true"
          :field="getFirstField(field, childModule)"
          :label="Object.values(field.fields)[0]?.label"
          :array="field.array"
          :active-only="'active' in field.fields"
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
        <div>{{ field.formValue || field.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent, inject, ref, reactive, watch, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { CInput, CTextbox, CCheckbox, CSelect } from 'frontend/components'

export default {
  components: {
    CInput,
    CTextbox,
    CCheckbox,
    CSelect,
    CSearch: defineAsyncComponent(() => import('frontend/components/molecules/CSearch/CSearch.vue')),
  },

  props: {
    form: {
      type: Object,
      required: true,
      validator: (v) => Object.values(v).every((v) => !!v.label)
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
  },

  setup(props) {

    const store = useStore()
    const module = ref(inject('module', ''))

    const moduleRefs = reactive({})
    watch(module, () => Object.assign(moduleRefs, useModule(module.value, store)), { immediate: true })

    const filterFields = (condition) => 
      Object.entries(props.form)
        .filter(([, field]) => field && !field.meta && !field.noform)
        .filter(([, field]) => condition(field))

    const fields = filterFields((f) => typeof f.module !== 'string')
    const moduleFields = filterFields((f) => typeof f.module === 'string')
    .map(([key, value]) => [key, {
      array: !!value.array,
      expand: !!value.expand,
      label: value.label,
      ...store.getters[`${value.module}/description`]
    }])

    return {
      module,
      fields,
      moduleFields,
      allInOne: Object.entries(props.form)
      .sort((a, b) => typeof a.module === typeof b.module ? 1 : -1)
      .map(([key, field]) => {
        return [key, {
        label: field.label,
        value: moduleRefs.formatValue(props.formData[key], key, true),
      }]
      }),

      getFirstField: ref(moduleRefs.getFirstField)
    }
  }
}
</script>
