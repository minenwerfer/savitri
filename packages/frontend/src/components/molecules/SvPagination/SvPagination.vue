<template>
  <div class="grid">
    <div class="flex gap-x-2 justify-self-end">
      <div class="self-center">
        Página
      </div>
      <sv-select @change="paginate(+$event.target.value)">
        <option
          v-for="page in pageCount"
          :key="`page-${page}`"
        >
          {{ page }}
        </option>
      </sv-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { SvSelect } from 'frontend/components'

const SvBareButton = defineAsyncComponent(() => import('frontend/components/atoms/SvBareButton/SvBareButton.vue'))

const props = defineProps<{
  module: string
}>()

const paginate = (page: number|string) => {
  store.dispatch(`${props.module}/paginate`, page)
}

const store = useStore()
const pageCount = computed(() => store.getters[`${props.module}/pageCount`])
const currentPage = computed(() => store.getters[`${props.module}/currentPage`])
</script>
