<template>
  <sv-tabbed
    :tabs="2"
    :bottom-helpers="false"
    :titles="['Sistema local', 'Base']"
    v-model:current-tab="currentTab"
    :key="items"
    >
    <template #tab-1>
      <sv-releases-item :items="item.product"></sv-releases-item>
    </template>
    <template #tab-2>
      <sv-releases-item :items="item.base"></sv-releases-item>
    </template>
  </sv-tabbed>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { SvTabbed, } from 'frontend/components'
import { default as SvReleasesItem } from './_internals/components/SvReleasesItem/SvReleasesItem.vue'

const store = useStore()
const moduleRefs = reactive(useModule('release', store))

const currentTab = ref(1)

onMounted(() => {
  if( moduleRefs.items.length === 0 ) {
    moduleRefs.getAll()
  }
})

const {
  item

} = toRefs(moduleRefs)
</script>
