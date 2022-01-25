<template>
  <div class="grid gap-y-4" v-if="Object.keys(columns).length > 0">
    <div class="overflow-hidden rounded-md">
      <table class="w-full table-fixed sm:text-center border-collapse">
        <tr class="leading-9 bg-gray-100">
          <th class="hidden sm:table-cell w-10 border" v-if="module">
            <input type="checkbox" @change="store.dispatch(`${module}/selectAll`, $event.target.checked)" />
          </th>
          <th
            v-for="(header, index) in columns"
            :key="`header-${index}`"
            class="hidden sm:table-cell truncate px-1 border"
          >
            {{ header.label || header.placeholder }}
          </th>
        </tr>

        <tr v-for="(row, rindex) in rows" :key="`row-${rindex}`" :class="`block shadow mb-4 sm:table-row sm:shadow-none leading-9 hover:bg-gray-100 ${rindex %2 !== 0 ? 'bg-gray-50' : ''}`">
          <td class="hidden sm:table-cell border" v-if="module">
            <input type="checkbox" v-model="selected" :value="{ _id: row._id }"/>
          </td>
          <td
            v-for="([column, field], cindex) in Object.entries(columns)"
            :key="`column-${rindex}-${cindex}`"
            @click="store.dispatch(`${module}/spawnOpen`, { payload: { filters: row } })"

            class="block sm:table-cell truncate sm:text-sm px-1 cursor-pointer border"
          >
          <div class="grid grid-cols-2 sm:inline-block justify-between">
            <div class="font-semibold opacity-60 sm:hidden text-ellipsis truncate">{{ field.label }}</div>

            <div v-if="column !== '__custom'" class="opacity-80 text-right sm:text-left">
              {{ formatValue(field.translate ? $t(row[column]) : row[column], column, false, field) }}
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

const {
  formatValue,
  recordsCount,
  recordsTotal

} = toRefs(moduleRefs)
</script>
