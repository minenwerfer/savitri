<template>
  <sv-box
    overlay
    class="global-container"
    @overlay-click="emit('close')"
  >
    <div class="global">
      <div class="global__searchbar">
        <sv-input
          v-model.lazy="query"
          variant="bold"
          :property="{
            type: 'string',
            s$placeholder: placeholder,
            s$icon: 'search',
            s$inputType: 'search',
            s$focus: true
          }"
        ></sv-input>
      </div>

      <sv-search-results
        v-loading="isTyping"

        class="global__results"
        @action-click="emit('close')"
      ></sv-search-results>
    </div>
  </sv-box>
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue'
import { useHttp, useDebounce } from '../../../../web'
import { SvBox, SvInput } from '../../..'
import { results, isTyping } from './_internals/store'
import SvSearchResults from './_internals/components/sv-search-results/sv-search-results.vue'

type Props = {
  placeholder?: string
}

type Emits = {
  (e: 'close'): void
}

const emit = defineEmits<Emits>()
const props = withDefaults(defineProps<Props>(), {
  placeholder: 'search'
})

const { http } = useHttp()
const query = ref('')

provide('iconReactive', false)

const search = async () => {
  if( query.value.length === 0 ) {
    results.items = []
    return
  }

  results.items = (await http('_/searchable/search', {
    query: query.value
    .replace(/(\(|\))/g, '')
    .split(',')
    .map((q: string) => q.trim())
  })).data.result
}

const debounce = useDebounce({
  delay: 800
})

const [doLazySearch] = debounce(() => {
  search()
  isTyping.value = false
})

watch(() => query.value, () => {
  isTyping.value = true
  doLazySearch()
})
</script>

<style scoped src="./sv-global-search.scss"></style>
