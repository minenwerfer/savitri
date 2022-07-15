<template>
  <div class="pagination" @change="paginate">
    <div class="pagination__control">
      <div>Limite</div>
      <sv-select v-model="limit">
        <option
          v-for="limit in [10, 35, 100, 150]"
          :key="`limit-${limit}`"
        >
          {{ limit }}
        </option>
      </sv-select>
    </div>
    <div class="pagination__control">
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
import { SvSelect } from '../../'

const SvBareButton = defineAsyncComponent(() => import('../..//atoms/sv-bare-button/sv-bare-button.vue'))

interface Props {
  module: string
}

const props = defineProps<Props>()

const page = ref<number>(1)
const limit = ref<number>(35)

const paginate = () => {
  store.dispatch(`${props.module}/paginate`, { page: +page.value, limit: +limit.value })
}

const store = useStore()
const pageCount = computed(() => store.getters[`${props.module}/pageCount`])
const currentPage = computed(() => store.getters[`${props.module}/currentPage`])
</script>

<style scoped src="./sv-pagination.scss"></style>
