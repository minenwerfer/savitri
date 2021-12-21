<template>
  <div class="grid gap-y-4">
    <div class="overflow-hidden rounded-md">
      <table class="w-full table-fixed sm:text-center border-collapse">
        <tr class="leading-8 bg-gray-100">
          <th class="hidden sm:table-cell w-10 border" v-if="module">
            <input type="checkbox" @change="store.dispatch(`${module}/selectAll`, $event.target.checked)" />
          </th>
          <th
            v-for="(header, index) in columns"
            :key="`header-${index}`"
            class="hidden sm:table-cell truncate px-1 border"
          >
            {{ header.label }}
          </th>
        </tr>

        <tr v-for="(row, rindex) in rows" :key="`row-${rindex}`" :class="`block mb-8 sm:table-row leading-8 ${rindex %2 !== 0 ? 'bg-gray-100' : ''}`">
          <td class="hidden sm:table-cell border" v-if="module">
            <input type="checkbox" v-model="selected" :value="{ _id: row._id }"/>
          </td>
          <td
            v-for="([column, field], cindex) in Object.entries(columns)"
            :key="`column-${rindex}-${cindex}`"
            class="block sm:table-cell truncate text-sm px-1 cursor-pointer border"
            @click="store.dispatch(`${module}/spawnOpen`, { payload: { filter: row } })"
          >
          <div class="grid grid-cols-2 md:inline-block justify-between">
            <div class="font-semibold sm:hidden text-ellipsis truncate">{{ field.label }}</div>

            <div v-if="column !== '__custom'" class="opacity-80">
              {{ formatValue(field.translate ? $t(row[column]) : row[column], column) }}
            </div>

            <div v-else class="flex gap-x-1">
              <c-bare-button v-for="(action, aindex) in columns.__custom.actions" :key="`action-${rindex}-${aindex}`" @clicked="action.click(row)" class="cursor-pointer">
                {{ action.name }}
              </c-bare-button>
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

<script>
import { inject, ref, reactive, watch, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { CBareButton } from 'frontend/components'

export default {
  components: {
    CBareButton,
  },

  props: {
    columns: {
      type: Object,
      required: true,
    },
    rows: {
      type: Object,
      required: true,
      validator: (v) => Array.isArray(v)
    },
    recordsCount: {
      type: Number,
      required: false,
    },
    recordsTotal: {
      type: Number,
      required: false,
    }
  },

  computed: {
    selected: {
      get() {
        return this.store.state[this.module].selected
      },
      set(items) {
        this.store.dispatch(`${this.module}/selectMany`, { items, value: true })
      }
    }
  },

  setup() {
    const store = useStore()
    const module = ref(inject('module'))

    const moduleRefs = reactive({})
    watch(module, () => Object.assign(moduleRefs, useModule(module.value, store)), { immediate: true })

    return {
      store,
      module,
      ...toRefs(moduleRefs)
    }
  }
}
</script>
