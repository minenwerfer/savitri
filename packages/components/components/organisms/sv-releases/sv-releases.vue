<template>
  <sv-tabbed
    :tabs="2"
    :bottom-helpers="false"
    :titles="['Sistema local', 'Base']"
    v-model:current-tab="currentTab"
    :key="item.base"
  >
    <template #tab-1>
      <sv-item :items="item.product"></sv-item>
    </template>
    <template #tab-2>
      <sv-item :items="item.base"></sv-item>
    </template>
  </sv-tabbed>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useModule } from '../../../../frontend'
import { SvTabbed } from '../..'
import { default as SvItem } from './_internals/components/sv-item/sv-item.vue'

const store = useStore()
const moduleRefs = reactive(useModule('release', store))

const currentTab = ref(0)

onMounted(() => {
  if( !moduleRefs.item?.base?.length ) {
    moduleRefs.getAll()
  }
})

const {
  item

} = toRefs(moduleRefs)
</script>
