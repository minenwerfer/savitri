<template>
  <table v-if="Object.keys(columns).length > 0" class="table">
    <tr v-if="headers" class="table__row table__row--header">
      <th
        v-if="checkbox"
        :class="`
          table__header
          table__header--checkbox
          ${border && 'table__header--border'}
      `">
        <input
          type="checkbox"
          @change="store.selectAll($event.target.checked)"
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
      <th
        v-if="actions"
        style="text-align: right;"
        :class="`
          table__header
          table__header--label
          ${border && 'table__header--border'}
      `">
        Ações
      </th>
    </tr>

    <tr
      v-for="row in rows"
      :key="row._id"
      :class="`table__row table__row--body`"
    >
      <td v-if="checkbox">
        <input
          type="checkbox"
          v-model="selected"
          :value="{ _id: row._id }"
        />
      </td>
      <td
        v-for="([column, field], cindex) in Object.entries(columns)"
        :key="`column-${row._id}-${cindex}`"
        :class="`
          table__cell
          table__cell--padded
          ${border && 'table__cell--border'}
      `">

        <div class="table__cell-grid">
          <!-- responsivity on mobile -->
          <div style="display: none">
            {{ field.label }}
          </div>

          <div v-if="field.type !== 'image'">
            <div :class="cindex === 0 && 'font-semibold opacity-80'">
              <sv-picture
                v-if="field.collection === 'file' && row[column]._id" 
                :file="row[column]"
                class="w-20 h-20 object-cover mb-4 lg:mb-0 border"
              ></sv-picture>
              <div v-else>
                {{
                  store.formatValue({
                    value: field.translate ? $t(row[column]||'-') : row[column],
                    key: column,
                    form: false,
                    field
                  })
                }}
              </div>
            </div>
            <div v-if="store.getIndexes({ key: column })?.length > 1">
              <div
                v-for="(subvalue, index) in store.getIndexes({ key: column }).slice(1, 2)"
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

        </div>
      </td>
      <td v-if="actions">
        <sv-dropdown-trigger>
          <teleport :to="`#dropdown-${row._id}`">
            <sv-dropdown-content v-bind="{
              row,
              actions
            }"></sv-dropdown-content>
          </teleport>
        </sv-dropdown-trigger>
      </td>
      <div :id="`dropdown-${row._id}`"></div>
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

import { useParentStore, useFile } from '@savitri/web'

import {
  SvBareButton,
  SvPicture,
  SvIcon

} from '../..'

import SvDropdownTrigger from './_internals/components/sv-dropdown-trigger/sv-dropdown-trigger.vue'
import SvDropdownContent from './_internals/components/sv-dropdown-content/sv-dropdown-content.vue'

type Props = {
  columns: any
  rows: any
  collection?: string
  checkbox?: boolean
  border?: boolean
  headers?: boolean
  actions?: any
}

const props = withDefaults(defineProps<Props>(), {
  checkbox: true,
  border: false,
  headers: true
})

const store = useParentStore(props.collection)

const selected = computed({
  get: () => store.selected,
  set: (items: Array<any>) => store.selectMany({ items, value: true })
})

const rowCtx = {
  date: (() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })()
}
</script>

<style scoped src="./sv-table.scss"></style>
