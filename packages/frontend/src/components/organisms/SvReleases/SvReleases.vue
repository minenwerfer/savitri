<template>
  <div>
    <sv-overlay @click="$emit('close')"></sv-overlay>
    <div class="fixed top-0 right-0 z-50 h-screen bg-gray-100 md:px-4 py-6 w-screen md:w-3/6 lg:w-2/6 shadow-lg animate-slip">
      <div class="flex flex-col gap-y-6">
        <div class="flex justify-between">
          <strong class="text-xl px-2">Notas de atualização</strong>
          <sv-bare-button @clicked="$emit('close')">
            <unicon name="multiply" fill="black"></unicon>
          </sv-bare-button>
        </div>

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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import useModule from 'frontend/composables/module'
import { SvTabbed, SvBareButton, SvOverlay } from 'frontend/components'
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
