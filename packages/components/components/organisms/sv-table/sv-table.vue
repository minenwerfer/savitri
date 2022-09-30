<template>
  <table v-if="Object.keys(columns).length > 0" class="table">
    <tbody>
      <tr
        v-if="headers"
        class="
          table__row
          table__row--header
      ">
        <th
          v-if="checkbox && store"
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
        `"></th>
      </tr>

      <tr
        v-for="row in rows"
        :key="row._id"
        :class="`table__row table__row--body`"
        @click="$emit('itemClick', row)"
      >
        <td
          v-if="store && checkbox"
          :class="`
            table__cell
            table__cell--padded
        `">
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
        `">

          <div class="table__cell-grid">
            <!-- responsivity on mobile -->
            <div style="display: none">
              {{ field.label }}
            </div>

            <div v-if="field.type === 'image'">
              <img
                :src="row[column].src"
                v-if="row[column]?.src"
              />
            </div>

            <div v-else-if="field.type === 'boolean'">
              <sv-switch
                v-bind="field"
                v-model="row[column]"
                @update:model-value="toggle($event, row._id, column)"
              ></sv-switch>
            </div>

            <div v-else>
              <div>
                <sv-picture
                  v-if="field.collection === 'file'" 
                  :file="row[column]"
                  class="table__picture"
                ></sv-picture>
                <div v-else-if="store">
                  {{
                    store.formatValue({
                      value: field.translate ? $t(row[column]||'-') : row[column],
                      key: column,
                      form: false,
                      field
                    })
                  }}
                </div>
                <div v-else>
                  {{ row[column] || '-' }}
                </div>
              </div>
              <div v-if="store?.getIndexes({ key: column })?.length > 1 && field.collection !== 'file'">
                <div
                  v-for="(subvalue, index) in store.getIndexes({ key: column }).slice(1, 2)"
                  :key="`subvalue-${index}`"
                >
                  {{ row[column]?.[subvalue] }}
                </div>
              </div>
            </div>

          </div>
        </td>
        <td
          v-if="actions?.length > 0"
          class="table__cell"
        >
          <sv-dropdown v-bind="{
            subject: row,
            actions
          }">
            <sv-icon
              v-clickable
              reactive
              name="setting"
            ></sv-icon>
          </sv-dropdown>
          <!-- <sv-dropdown-trigger :id="row._id"> -->
          <!--   <teleport :to="`#dropdown-${row._id}`"> -->
          <!--     <sv-dropdown-content v-bind="{ -->
          <!--       subject: row, -->
          <!--       actions, -->
          <!--     }"></sv-dropdown-content> -->
          <!--   </teleport> -->
          <!-- </sv-dropdown-trigger> -->
        </td>
        <div :id="`dropdown-${row._id}`"></div>
      </tr>
    </tbody>
    <tfoot>
      <tr v-if="!rows?.length && !store?.isLoading">
        <td :colspan="Object.keys(columns).length">
          <div class="table__empty">
            Não foram encontrados resultados.
          </div>
        </td>
      </tr>
    </tfoot>
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

import { useStore, useFile } from '@savitri/web'

import {
  SvBareButton,
  SvIcon,
  SvPicture,
  SvDropdown,
  SvSwitch

} from '../..'

// import SvDropdownTrigger from './_internals/components/sv-dropdown-trigger/sv-dropdown-trigger.vue'
// import SvDropdownContent from './_internals/components/sv-dropdown-content/sv-dropdown-content.vue'

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
  border: true,
  headers: true
})

const collectionName = props.collection || inject('storeId', null)
const store = collectionName
  ? useStore(collectionName.value||collectionName)
  : null

const selected = computed({
  get: () => store.selected,
  set: (items: Array<any>) => store.selectMany({ items, value: true })
})

//const rowCtx = {
//  date: (() => {
//    const date = new Date()
//    date.setHours(0, 0, 0, 0)
//    return date
//  })()
//}

const toggle = (value, rowId, key) => {
  if( store ) {
    store.insert({
      what: {
        _id: rowId,
        [key]: value
      }
    }, {
      skipLoading: true
    })
  }
}
</script>

<style scoped src="./sv-table.scss"></style>
