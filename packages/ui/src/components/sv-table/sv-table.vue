<script setup lang="ts">
import { inject, computed } from 'vue'
import { useStore, useCondition } from '@savitri/web'
import type { CollectionProperty } from '@semantic-api/types'

import SvButton from '../sv-button/sv-button.vue'
import SvIcon from '../sv-icon/sv-icon.vue'
import SvPicture from '../sv-picture/sv-picture.vue'
import SvContextMenu from '../sv-context-menu/sv-context-menu.vue'
import SvSwitch from '../form/sv-switch/sv-switch.vue'

type Props = {
  columns?: Record<string, CollectionProperty>
  rows?: any
  collection?: string
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
  set: (items: Array<any>) => store.selectManyItems(items, true)
})

const buttonActions = computed(() => (
  props.actions?.filter((action) => props.layout?.actions?.[action.action]?.button) || []
))

const dropdownActions = computed(() => (
  props.actions?.filter((action) => !props.layout?.actions?.[action.action]?.button) || []
))

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

<template>
  <table
    v-if="(columns && Object.keys(columns).length > 0) || $slots.thead"
    class="
      sv-surface
      table
    "
  >
    <thead v-if=$slots.thead>
      <slot name="thead"></slot>
    </thead>

    <thead v-else-if="headers && (!store || store.loading.getAll || store.itemsCount > 0)">
      <tr v-if="headers">
        <th v-if="checkbox && store">
          <input
            type="checkbox"
            :checked="store.selected.length > 0 && store.selected.length === store.itemsCount"
            @change="store.selectAllItems($event.target.checked)"
          />
        </th>
        <th
          v-for="([propertyName, property], index) in Object.entries(columns)"
          :key="`header-${index}`"
          :class="`
            table__header
            ${border && 'table__header--border'}
        `">
          {{ property.description || $t(propertyName) }}
        </th>
        <th
          v-if="actions"
          style="text-align: right;"
         ></th>
      </tr>
    </thead>

    <tbody v-if="$slots.tbody">
      <slot name="tbody"></slot>
    </tbody>

    <tbody v-else>
      <tr
        v-for="row in rows"
        :key="row._id"
        @click="$emit('itemClick', row)"
      >
        <td v-if="store && checkbox">
          <input
            type="checkbox"
            v-model="selected"
            :value="row._id"
          />
        </td>
        <td
          v-for="([column, property], cindex) in Object.entries(columns)"
          :key="`column-${row._id}-${cindex}`"
        >
          <div
            v-if="`row-${column}` in $slots"
            class="table__cell-container"
          >
            <slot
              v-bind="{
                store,
                column,
                property,
                row
              }"

              :name="`row-${column}`"
            >
            </slot>
          </div>
          <div
            v-else
            class="table__cell-container"
          >
            <div class="table__cell-mobile-label">
              {{ property.description || $t(column) }}
            </div>

            <div class="table__cell-grid">
              <div v-if="property.type === 'boolean'">
                <sv-icon
                  v-if="row[column]"
                  small
                  name="check"
                  fill="green"
                >
                  {{ $t('yes') }}
                </sv-icon>
                <sv-icon
                  v-else
                  small
                  name="times"
                  fill="red"
                >
                  {{ $t('no') }}
                </sv-icon>
              </div>

              <div v-else>
                <div v-if="property.$ref === 'file' && row[column]">
                  <sv-picture
                    expandable
                    v-if="/^image/.test(row[column].mime)" 
                    v-model="row[column].link"
                    :meta="row[column]"
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
                <span v-else-if="store">
                  {{
                    store.formatValue({
                      value: row[column],
                      key: column,
                      property
                    })
                  }}
                </span>
                <span v-else>
                  {{
                    Array.isArray(row[column])
                      ? row[column].filter(_ => !!_).join(', ')
                      : ![undefined, null].includes(row[column])
                        ? row[column]
                        : '-'
                  }}
                </span>
              </div>
              <div v-if="
                property.s$indexes?.length > 1
                  && property.s$referencedCollection !== 'file'
              ">
                <div
                  v-for="(subvalue, index) in property.s$indexes.slice(1, 2)"
                  :key="`subvalue-${index}`"
                >
                  {{
                    store.formatValue({
                      value: row[column],
                      key: column,
                      property,
                      index: subvalue
                    })
                  }}
                </div>
              </div>
            </div>
          </div>

        </td>
        <td
          v-if="actions?.length"
          class="no-print table__cell"
        >
          <div class="table__cell-actions">
            <sv-button
              small
              v-for="action in buttonActions"
              :key="`action-${action.action}`"
              variant="transparent"
              :icon="action.icon"

              :style="buttonStyle(row, action)"
              @click="action.click(row)"
            >
              {{ $t(action.name) }}
            </sv-button>
            <sv-context-menu
              v-if="dropdownActions.length > 0"
              v-bind="{
                subject: row,
                actions: dropdownActions
            }">
              <sv-icon
                v-clickable
                reactive
                name="ellipsis-h"
              ></sv-icon>
            </sv-context-menu>
          </div>
        </td>
        <div :id="`dropdown-${row._id}`"></div>
      </tr>
    </tbody>
    <tfoot>
      <slot
        name="tfoot"
        v-if="$slots.tfoot"
      ></slot>

      <tr v-else-if="columns && !rows?.length && !store?.loading.getAll">
        <td :colspan="Object.keys(columns).length">
          <div class="table__empty">
            Não foram encontrados resultados.
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<style scoped src="./sv-table.scss"></style>
