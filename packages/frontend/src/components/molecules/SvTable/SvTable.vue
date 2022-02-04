<template>
  <div class="grid gap-y-4" v-if="Object.keys(columns).length > 0">
    <div class="overflow-hidden rounded-md">
      <table class="w-full">
        <tr class="leading-9 text-xs uppercase text-left">
          <th class="hidden lg:table-cell w-10 px-2" v-if="module">
            <input type="checkbox" @change="store.dispatch(`${module}/selectAll`, $event.target.checked)" />
          </th>
          <th
            v-for="(header, index) in columns"
            :key="`header-${index}`"
            class="hidden lg:table-cell truncate"
          >
            {{ header.label || header.placeholder }}
          </th>
        </tr>

        <tr v-for="(row, rindex) in rows" :key="`row-${rindex}`" :class="`block shadow mb-4 lg:table-row lg:shadow-none leading-10 hover:bg-gray-50 ${computedRowColor(row, rindex)}`">
          <td class="hidden lg:table-cell px-2" v-if="module">
            <input type="checkbox" v-model="selected" :value="{ _id: row._id }" />
          </td>
          <td
            v-for="([column, field], cindex) in Object.entries(columns)"
            :key="`column-${rindex}-${cindex}`"
            @click="store.dispatch(`${module}/spawnOpen`, { payload: { filters: row } })"

            class="block lg:table-cell truncate cursor-pointer border-b lg:border-none"
          >
          <div class="grid grid-cols-2 lg:inline-block justify-between lg:text-sm">
            <div class="font-semibold opacity-60 lg:hidden text-ellipsis truncate">{{ field.label }}</div>

            <div
              v-if="column !== '__custom'"
              class="grid gap-y-1 opacity-80 text-right"
            >
              <div :class="cindex === 0 ? 'font-semibold opacity-80' : ''">
                {{ formatValue(field.translate ? $t(row[column]||'-') : row[column], column, false, field) }}
              </div>
              <div v-if="getIndexes(row[column], column)?.length > 1" class="hidden lg:flex gap-x-2">
                <div
                  v-for="(subvalue, index) in getIndexes(row[column], column).slice(1, 2)"
                  :key="`subvalue-${index}`"
                  class="text-sm text-blue-500"
                >
                  {{ row[column][subvalue] }}
                </div>
              </div>
            </div>

            <div v-else class="flex gap-x-1 justify-end">
              <sv-bare-button v-for="(action, aindex) in columns.__custom.actions" :key="`action-${rindex}-${aindex}`" @clicked="action.click(row)" class="cursor-pointer">
                {{ action.name }}
              </sv-bare-button>
            </div>
          </div>
          </td>
        </tr>
      </table>
    </div>

    <div v-if="recordsCount && recordsTotal" class="justify-self-end text-sm opacity-80">
      Mostrando {{ recordsCount }} de {{ recordsTotal }} registros
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch, reactive, computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
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
  recordsCount: {
    type: Number,
    required: false,
  },
  recordsTotal: {
    type: Number,
    required: false,
  },
  module: {
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

const bgColorClasses = {
  yellow: 'bg-yellow-100',
  red: 'bg-red-100',
}

const computedRowColor = (row: any, rindex: number) => {
  if( !props.rowColor ) {
    return rindex % 2 !== 0
      ? 'bg-gray-50'
      : ''
  }

  const color = (Object.entries(props.rowColor)
    .find(([key, value]: [string, any]) => eval(value)(row, rowCtx))||[])[0]

  return bgColorClasses[color]||'bg-white'
}

const {
  getIndexes,
  formatValue,
  recordsCount,
  recordsTotal

} = toRefs(moduleRefs)
</script>
