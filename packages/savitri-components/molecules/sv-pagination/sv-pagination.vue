<template>
  <div class="flex gap-x-4" @change="paginate">
    <div class="flex items-center gap-x-2">
      <div>Limite</div>
      <sv-select v-model="limit">
        <option v-for="limit in [10, 35, 100, 150]" :key="`limit-${limit}`">
          {{ limit }}
        </option>
      </sv-select>
    </div>
    <div class="flex items-center gap-x-2">
      <div>Página</div>
      <sv-select v-model="page">
        <option v-for="page in pageCount" :key="`page-${page}`">
          {{ page }}
        </option>
      </sv-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { SvSelect } from 'components'

const SvBareButton = defineAsyncComponent(() => import('components/atoms/sv-bare-button/sv-bare-button.vue'))

const props = defineProps<{
  module: string
}>()

const page = ref<number>(1)
const limit = ref<number>(35)

const paginate = () => {
  store.dispatch(`${props.module}/paginate`, { page: +page.value, limit: +limit.value })
}

const store = useStore()
const pageCount = computed(() => store.getters[`${props.module}/pageCount`])
const currentPage = computed(() => store.getters[`${props.module}/currentPage`])
</script>
