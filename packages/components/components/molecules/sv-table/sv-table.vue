<template>
  <table v-if="Object.keys(columns).length > 0" class="table">
    <tr v-if="headers" class="table__row table__row--header">
      <th
        v-if="module && checkbox"
        :class="`
          table__header
          table__header--checkbox
          ${border && 'table__header--border'}
      `">
        <input
          type="checkbox"
          @change="store.dispatch(`${module}/selectAll`, $event.target.checked)"
        />
      </th>
      <th
        v-for="(header, index) in columns"
        :key="`header-${index}`"
        :class="`
          table__header
          table__header--label
          ${border && 'table__header--border'}
      `">
        {{ header.label || header.placeholder }}
      </th>
    </tr>

    <tr
      v-for="(row, rindex) in rows"
      :key="`row-${rindex}`"
      :class="`table__row table__row--body`"
      @click="moduleRefs.setItem(row)"
    >
      <td v-if="module && checkbox">
        <input
          type="checkbox"
          v-model="selected"
          :value="{ _id: row._id }"
        />
      </td>
      <td
        v-for="([column, field], cindex) in Object.entries(columns)"
        :key="`column-${rindex}-${cindex}`"
        :class="`
          table__cell
          ${column !== '__custom' && 'table__cell--padded'}
          ${border && 'table__cell--border'}
      `">

        <div class="table__cell-grid">
          <!-- responsivity on mobile -->
          <div style="display: none">
            {{ field.label }}
          </div>

          <div
            v-if="column !== '__custom' && field.type !== 'image'"
            :class="`grid gap-y-1 opacity-80 justify-end ${ computedCellStyle(row, field) }`"
          >
            <div :class="cindex === 0 && 'font-semibold opacity-80'">
              <sv-picture
                v-if="field.module === 'file' && row[column]._id" 
                :file="row[column]"
                class="w-20 h-20 object-cover mb-4 lg:mb-0 border"
              ></sv-picture>
              <div v-else>
                {{
                  store1.formatValue({
                    value: field.translate ? $t(row[column]||'-') : row[column],
                    key: column,
                    form: false,
                    field
                  })
                }}
              </div>
            </div>
            <div v-if="getIndexes(column)?.length > 1" class="hidden lg:flex gap-x-2">
              <div
                v-for="(subvalue, index) in getIndexes(column).slice(1, 2)"
                :key="`subvalue-${index}`"
                class="text-sm text-blue-500"
              >
                {{ row[column]?.[subvalue] }}
              </div>
            </div>
          </div>

          <div v-else-if="field.type === 'image'">
            <img
              :src="row[column].src"
              v-if="row[column]?.src"
            />
          </div>

          <sv-dropdown-trigger v-else>
            <teleport :to="`#dropdown-${rindex}`">
              <sv-dropdown-content v-bind="{
                row,
                actions: columns.__custom.actions
              }"></sv-dropdown-content>
            </teleport>
          </sv-dropdown-trigger>
        </div>
      </td>
      <div :id="`dropdown-${rindex}`"></div>
    </tr>
  </table>
</template>

<script setup lang="ts">
import {
  inject,
  ref,
  watch,
  reactive,
  computed,
  toRefs

} from 'vue'

import { useStore } from 'vuex'
import { useModule, useFile } from '../../../../web'
import { useParentStore } from '../../../../web'

import {
  SvBareButton,
  SvPicture,
  SvIcon

} from '../..'

import SvDropdownTrigger from './_internals/components/sv-dropdown-trigger/sv-dropdown-trigger.vue'
import SvDropdownContent from './_internals/components/sv-dropdown-content/sv-dropdown-content.vue'

interface Props {
  columns: any
  rows: any
  module?: string
  checkbox?: boolean
  border?: boolean
  headers?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  checkbox: true,
  border: false,
  headers: true
})

const store = useStore()
const store1 = useParentStore()
const module = ref<string>(props.module || inject('module', ''))

const moduleRefs = reactive({})
watch(module, () => Object.assign(moduleRefs, useModule(module.value, store)), { immediate: true })

const selected = computed({
  get: () => store.state[module.value].selected,
  set: (items: Array<any>) => store.dispatch(`${module.value}/selectMany`, { items, value: true })
})

const rowCtx = {
  date: (() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })()
}

const computedCellStyle = (row: any, field: any) => {
  if( !field.cellStyle ) {
    return
  }

  const cellStyle = eval(field.cellStyle)
  return cellStyle(row)
}

const {
  getIndexes,
  formatValue,

} = toRefs(moduleRefs)
</script>

<style scoped src="./sv-table.scss"></style>
