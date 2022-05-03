<template>
  <table v-if="Object.keys(columns).length > 0" class="w-full">
    <tr class="leading-9 text-xs uppercase text-left bg-gray-50 border-b" v-if="headers">
      <th v-if="module && checkbox" :class="`hidden lg:table-cell w-10 px-2 ${border && 'border'}`">
        <input type="checkbox" @change="store.dispatch(`${module}/selectAll`, $event.target.checked)" />
      </th>
      <th
        v-for="(header, index) in columns"
        :key="`header-${index}`"
        :class="`hidden lg:table-cell truncate ${!checkbox && 'first:lg:pl-4'} ${border && 'border'}`"
        >
        {{ header.label || header.placeholder }}
      </th>
    </tr>

    <tr
      v-for="(row, rindex) in rows"
      :key="`row-${rindex}`"
      :class="`block shadow mb-3 last:mb-0 p-2 lg:p-0 lg:table-row lg:shadow-none leading-8 lg:leading-10 hover:bg-gray-200 ${computedRowColor(row, rindex)}`"

      @click="moduleRefs.setItem(row)"
      >
      <td v-if="module && checkbox" :class="`hidden lg:table-cell px-2 ${ border && 'border' }`">
        <input type="checkbox" v-model="selected" :value="{ _id: row._id }" />
      </td>
      <td
        v-for="([column, field], cindex) in Object.entries(columns)"
        :key="`column-${rindex}-${cindex}`"
        :class="`block lg:table-cell truncate cursor-pointer lg:py-1 ${!checkbox && 'first:lg:pl-4'} ${border && 'border'}`"
      >
        <div class="grid grid-cols-2 lg:inline-block justify-between lg:text-sm align-middle">
          <div class="font-semibold opacity-60 lg:hidden text-ellipsis truncate">{{ field.label }}</div>
          <div
            v-if="column !== '__custom' && field.type !== 'image'"
            :class="`grid gap-y-1 opacity-80 justify-end ${ computedCellStyle(row, field) }`"
            >
            <div :class="cindex === 0 && 'font-semibold opacity-80'">
              <div v-if="field.module === 'file' && row[column]._id">
                <img :src="useFile(row[column]).link" class="w-20 h-20 object-cover mb-4 lg:mb-0 border"/>
              </div>
              <div v-else>
                {{ formatValue(field.translate ? $t(row[column]||'-') : row[column], column, false, field) }}
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
            <img :src="row[column].src" v-if="row[column]?.src" class="w-8 h-8 inline-block" />
          </div>

          <div v-else class="flex gap-x-2 justify-end w-full lg:w-auto">
            <sv-dropdown>
              <template #trigger>
                <div class="grid place-items-center border bg-white p-1 rounded shadow">
                  <sv-icon name="setting" fill="gray" class="w-5 h-5"></sv-icon>
                </div>
              </template>
              <template #content>
                <teleport :to="`#dropdown-${rindex}`">
                  <div :class="`absolute right-0 ${rindex > Object.keys(rows).length - 3 && 'bottom-0'} z-50 bg-white rounded border shadow-lg whitespace-nowrap`">
                    <sv-bare-button
                      v-for="(action, aindex) in filterActions(columns.__custom.actions)"
                      :key="`action-${rindex}-${aindex}`"
                      @clicked="action.click(row)"

                      class="w-full px-2 hover:bg-gray-100"
                      >
                      <div class="flex gap-x-2 items-center">
                        <sv-icon :name="action.unicon" fill="gray" v-if="action.unicon" class="w-5 h-5"></sv-icon>
                        <div>{{ action.name }}</div>
                      </div>
                    </sv-bare-button>
                  </div>
                </teleport>
              </template>
            </sv-dropdown>

          </div>
        </div>
      </td>
      <div :id="`dropdown-${rindex}`" class="relative"></div>
    </tr>
  </table>
</template>

<script setup lang="ts">
import { inject, ref, watch, reactive, computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useModule, useFile } from '../../../frontend'
import {
  SvBareButton,
  SvDropdown,
  SvIcon

} from '../../'

const props = defineProps({
columns: {
  type: Object,
  required: true,
},
rows: {
  type: Object,
  required: true,
  validator: (v: any) => Array.isArray(v)
},
module: {
  type: String,
  required: false
},
checkbox: {
  type: Boolean,
  default: true
},
border: {
  type: Boolean,
  defauçt: true
},
headers: {
  type: Boolean,
  default: true
},
cellStyle: {
  type: String,
  required: false
},
rowColor: {
  type: Object,
  required: false
}
})

const store = useStore()
const module = ref<string>(props.module || inject('module', ''))

const moduleRefs = reactive({})
watch(module, () => Object.assign(moduleRefs, useModule(module.value, store)), { immediate: true })

const selected = computed({
  get: () => store.state[module.value].selected,
  set: (items: any[]) => store.dispatch(`${module.value}/selectMany`, { items, value: true })
})

const rowCtx = {
  date: (() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })()
}

const fgColorClasses = {
  yellow: 'text-yellow-600',
  red: 'text-red-600',
  blue: 'text-blue-600'
}

const bgColorClasses = {
  yellow: 'bg-yellow-100',
  red: 'bg-red-100',
  blue: 'bg-blue-100'
}

const computedRowColor = (row: any, rindex: number) => {
  const color = !!props.rowColor && (Object.entries(props.rowColor)
    .find(([key, value]: [string, any]) => eval(value)(row, rowCtx))||[])[0]

  return color
    ? bgColorClasses[color]
    : ( rindex % 2 !== 0 ? 'bg-white lg:bg-gray-50' : 'bg-white' )
}

const computedCellStyle = (row: any, field: any) => {
  if( !field.cellStyle ) {
    return
  }

  const cellStyle = eval(field.cellStyle)
  return cellStyle(row)
}

const filterActions = (actions: any[]) => {
  return actions
    .filter((action: any) => !action.useronly || store.getters['user/current'].access.visibility !== 'useronly')
}

const {
  getIndexes,
  formatValue,

} = toRefs(moduleRefs)
</script>
