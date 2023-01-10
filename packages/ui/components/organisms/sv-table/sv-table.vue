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
          class="table__header"
        >
          <input
            type="checkbox"
            @change="store.selectAll($event.target.checked)"
          />
        </th>
        <th
          v-for="([propertyName, property], index) in Object.entries(columns)"
          :key="`header-${index}`"
          :class="`
            table__header
            table__header--description
            ${border && 'table__header--border'}
        `">
          {{ property.description || propertyName }}
        </th>
        <th
          v-if="actions"
          style="text-align: right;"
          :class="`
            table__header
            table__header--description
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
          v-for="([column, property], cindex) in Object.entries(columns)"
          :key="`column-${row._id}-${cindex}`"
          :class="`
            table__cell
            table__cell--padded
        `">

          <div class="table__cell-grid">
            <!-- responsivity on mobile -->
            <div style="display: none">
              {{ property.description }}
            </div>

            <!-- dormant -->
            <!-- <div v-if="property.type === 'image'"> -->
            <!--   <img -->
            <!--     :src="row[column].src" -->
            <!--     v-if="row[column]?.src" -->
            <!--   /> -->
            <!-- </div> -->

            <div v-if="property.type === 'boolean'">
              <sv-switch
                v-if="!property.readOnly"
                v-bind="{
                   property 
                }"
                v-model="row[column]"
                @update:model-value="toggle($event, row._id, column)"
              ></sv-switch>
              <sv-icon
                v-else
                small
                :name="row[column] ? 'check' : 'times'"
                :fill="row[column] ? 'green' : 'red'"
              >
                {{ $t(row[column] ? 'yes' : 'no') }}
              </sv-icon>
            </div>

            <div v-else>
              <div v-if="property.$ref === 'file' && row[column]">
                <sv-picture
                  v-if="/^image/.test(row[column].mime)" 
                  v-model="row[column].link"
                  class="table__picture"
                ></sv-picture>
                <a
                  v-else-if="row[column].link"
                  :href="row[column].link"
                  style="font-size: 10pt"
                >
                  {{ row[column].filename }}
                </a>
                <div v-else>
                  -
                </div>
              </div>
              <div v-else-if="store">
                {{
                  store.formatValue({
                    value: row[column],
                    key: column,
                    property
                  })
                }}
              </div>
              <div v-else>
                {{
                  Array.isArray(row[column])
                    ? row[column].filter(_ => !!_).join(', ')
                    : (row[column] || '-')
                }}
              </div>
            </div>
            <div v-if="store?.getIndexes({ key: column })?.length > 1 && property.collection !== 'file'">
              <div
                v-for="(subvalue, index) in store.getIndexes({ key: column }).slice(1, 2)"
                :key="`subvalue-${index}`"
              >
                <div v-if="typeof row[column]?.[subvalue] !== 'object'">
                  {{ row[column]?.[subvalue] }}
                </div>
              </div>
            </div>
          </div>
        </td>
        <td
          v-if="actions?.length"
          class="table__cell"
        >
          <div class="table__cell-actions">
            <sv-button
              small
              v-for="action in buttonActions"
              :key="`action-${action.action}`"
              variant="alt"
              :icon="action.icon"

              :style="buttonStyle(row, action)"
              @clicked="action.click(row)"
            >
              {{ action.name }}
            </sv-button>
            <sv-dropdown
              v-if="dropdownActions.length > 0"
              v-bind="{
                subject: row,
                actions: dropdownActions
            }">
              <sv-icon
                v-clickable
                reactive
                name="setting"
              ></sv-icon>
            </sv-dropdown>
          </div>
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
import { inject, computed } from 'vue'
import { useStore } from '../../../../web'
import type { CollectionProperty } from '@semantic-api/types'

import {
  SvButton,
  SvIcon,
  SvPicture,
  SvDropdown,
  SvSwitch

} from '../..'

import { useCondition } from '../../../composables'

type Props = {
  columns: Record<string, CollectionProperty>
  rows: any
  collection?: string&{ value: string }
  checkbox?: boolean
  border?: boolean
  headers?: boolean
  actions?: Array<CollectionAction & {
    action: string
    click: (...args: any[]) => void
  }>
  layout?: any
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

const buttonActions = computed(() => (
  props.actions?.filter((action) => props.layout?.actions?.[action.action]?.button) || []
))

const dropdownActions = computed(() => (
  props.actions?.filter((action) => !props.layout?.actions?.[action.action]?.button) || []
))

const toggle = (value: boolean, rowId: string, key: string) => {
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

const buttonStyle = (subject: any, action: any) => {
  const style = []
  const layout = props.layout?.actions?.[action.action]

  if( layout?.if ) {
    const result = useCondition(
      subject,
      layout.if
    )

    if( !result.satisfied ) {
      style.push(`display: none;`)
    }
  }

  return style.join('')
}
</script>

<style scoped src="./sv-table.scss"></style>
