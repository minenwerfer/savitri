<script setup lang="ts">
import { computed, watch } from 'vue'
import type { FiltersPreset } from '@semantic-api/types'
import { useRouter, useParentStore } from '@savitri/web'
import SvTabs from '../../sv-tabs/sv-tabs.vue'
import SvIcon from '../../sv-icon/sv-icon.vue'

type Props = {
  collection?: string
}

const props = defineProps<Props>()
const router = await useRouter()
const route = router.currentRoute

const store = computed(() => {
  try {
    const collection = props.collection
      ? props.collection
      : (route.value.meta?.collection || route.value.params?.collection) as string

    return useParentStore(collection)
  } catch( e ) {
    return null
  }
})

const togglePreset = (presetName: string, preset?: FiltersPreset) => {
  if( !store.value ) {
    return
  }

  return (({ value: store }) => {
    store.filtersPreset = preset?.filters || {}
    store.preferredTableProperties = preset?.table || []
    store.pagination.offset = 0
    router.push({ hash: presetName ? `#${presetName}` : '' })
  })(store)
}

watch(route, (currRoute, prevRoute) => {
  if( !store.value || prevRoute ) {
    return
  }

  const { hash: newHash } = currRoute

  return (({ value: store }) => {
    if( store.description.filtersPresets ) {
      if( newHash ) {
        const presetName = newHash.slice(1)
        togglePreset(presetName, store.description.filtersPresets[presetName])
        return
      }

      togglePreset('')
    }
  })(store)
}, { immediate: true })
</script>

<template>
  <div
    v-if="store && Object.keys(store.description.filtersPresets||{}).length > 0"
    class="topbar"
  >
    <sv-tabs v-if="store?.description.filtersPresets">
      <div
        v-clickable
        :data-current="!route.hash"
        @click="togglePreset('')"
      >
        {{ $t('all') }}
      </div>
      <div
        v-clickable
        v-for="([presetName, preset]) in Object.entries(store.description.filtersPresets)"
        :key="`filter-preset-${presetName}`"

        :data-current="route.hash === `#${presetName}`"
        @click="togglePreset(presetName, preset)"
      >
        <sv-icon
          v-if="preset.icon"
          small
          :name="preset.icon"
        >
          {{ preset.name || $tc(presetName, 2) }}
        </sv-icon>
        <span v-else>{{ preset.name || $tc(presetName, 2) }}</span>
        <span v-if="preset.badgeFunction">
          ({{
            store.customGetter[preset.badgeFunction](presetName, {
              filters: preset.filters
            })
          }})
        </span>
      </div>
    </sv-tabs>
  </div>
</template>

<style scoped src="./sv-crud-topbar.scss"></style>
