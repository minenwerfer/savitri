<template>
  <div class="grid">
    <div class="flex gap-x-2 justify-self-end">
      <div class="self-center">
        Página
      </div>
      <c-select @change="paginate(+$event.target.value)">
        <option
          v-for="page in pageCount"
          :key="`page-${page}`"
        >
          {{ page }}
        </option>
      </c-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { CSelect } from 'frontend/components'

const CBareButton = defineAsyncComponent(() => import('frontend/components/atoms/CBareButton/CBareButton.vue'))

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
