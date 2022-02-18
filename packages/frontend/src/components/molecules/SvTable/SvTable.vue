<template>
  <table class="w-full" v-if="Object.keys(columns).length > 0">
    <tr class="leading-9 text-xs uppercase text-left bg-white" v-if="headers">
      <th v-if="module && checkbox" :class="`hidden lg:table-cell w-10 px-2 ${border && 'border'}`">
        <input type="checkbox" @change="store.dispatch(`${module}/selectAll`, $event.target.checked)" />
      </th>
      <th
        v-for="(header, index) in columns"
        :key="`header-${index}`"
        :class="`hidden lg:table-cell truncate lg:pl-4 ${border && 'border'}`"
        >
        {{ header.label || header.placeholder }}
      </th>
    </tr>

    <tr v-for="(row, rindex) in rows" :key="`row-${rindex}`" :class="`block shadow mb-3 last:mb-0 p-2 lg:p-0 lg:table-row lg:shadow-none leading-8 lg:leading-10 hover:bg-gray-200 ${computedRowColor(row, rindex)}`">
    <td v-if="module && checkbox" :class="`hidden lg:table-cell px-2 ${ border && 'border' }`">
      <input type="checkbox" v-model="selected" :value="{ _id: row._id }" />
    </td>
    <td
      v-for="([column, field], cindex) in Object.entries(columns)"
      :key="`column-${rindex}-${cindex}`"
      @click="store.dispatch(`${module}/spawnOpen`, { payload: { filters: row } })"

      :class="`block lg:table-cell truncate cursor-pointer lg:pl-4 ${field.cellStyle || ''} ${ border && 'border' }`"
      >

      <div class="grid grid-cols-2 lg:inline-block justify-between lg:text-sm">
        <div class="font-semibold opacity-60 lg:hidden text-ellipsis truncate">{{ field.label }}</div>
        <div
          v-if="column !== '__custom' && field.type !== 'image'"
          :class="`grid gap-y-1 opacity-80 justify-end`"
          >
          <div :class="cindex === 0 && 'font-semibold opacity-80'">
            <div v-if="field.module === 'file' && row[column]._id" class="mt-2">
              <img :src="`${SV_API_URL}/download/${row[column]._id}`" class="w-20 h-20 mb-4 lg:mb-0"/>
            </div>
            <div v-else>
              {{ formatValue(field.translate ? $t(row[column]||'-') : row[column], column, false, field) }}
            </div>
          </div>
          <div v-if="getIndexes(row[column], column)?.length > 1" class="hidden lg:flex gap-x-2">
            <div
              v-for="(subvalue, index) in getIndexes(row[column], column).slice(1, 2)"
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

        <div v-else class="flex gap-x-1 justify-end">
          <sv-bare-button
            v-for="(action, aindex) in columns.__custom.actions"
            :key="`action-${rindex}-${aindex}`"
            @clicked="action.click(row)"

            :class="`cursor-pointer ${action.color && fgColorClasses[action.color]}`"
            >
            {{ action.name }}
          </sv-bare-button>
        </div>
      </div>
    </td>
  </tr>
</table>
</template>

<script setup lang="ts">
import { inject, ref, watch, reactive, computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { SV_API_URL } from 'frontend/store/module'
import { SvBareButton } from 'frontend/components'

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

const {
getIndexes,
formatValue,

} = toRefs(moduleRefs)
</script>
