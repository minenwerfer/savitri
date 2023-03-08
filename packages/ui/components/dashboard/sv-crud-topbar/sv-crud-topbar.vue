<template>
  <div class="topbar">
    <div
      v-if="store?.description.filtersPresets"
      class="topbar__presets"
    >
      <div
        v-clickable
        :class="`
          sv-weak
          topbar__preset
          ${!route.hash && 'topbar__preset--current'}
        `"

        style="
          display: flex;
          align-items: center;
        "
        @click="togglePreset('')"
      >
        {{ $t('all') }}
      </div>
      <div
        v-clickable
        v-for="([presetName, preset]) in Object.entries(store.description.filtersPresets)"
        :key="`filter-preset-${presetName}`"

        :class="`
          sv-weak
          topbar__preset
          ${route.hash === `#${presetName}` && 'topbar__preset--current'}
        `"
        @click="togglePreset(presetName, preset)"
      >
        <sv-icon
          v-if="preset.icon"
          small
          :name="preset.icon"
        >
          {{ preset.name }}
        </sv-icon>
        <span v-else>{{ preset.name }}</span>
        <span v-if="preset.badgeFunction">
          ({{
            store.customGetter[preset.badgeFunction](presetName, {
              filters: preset.filters
            })
          }})
        </span>
      </div>
    </div>
    <div
      v-if="store?.actions || $slots.actions"
      :key="collection"
      class="topbar__actions"
    >
      <sv-button
        v-for="(actionProps, index) in store.actions"
        :key="`action-${index}`"

        small
        :icon="actionProps.icon"
        :disabled="store.selectedIds.length === 0 && actionProps.selection"

        @clicked="call(actionProps)({ _id: selectedIds })"
      >
        {{ actionProps.name }}
      </sv-button>
      <slot v-if="$slots.actions" name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FiltersPreset } from '@semantic-api/types'
import { useParentStore } from '@savitri/web'
import { call } from '../../templates/sv-crud/_internals/store'
import { SvButton, SvIcon } from '../..'

const route = useRoute()
const router = useRouter()
const store = computed(() => {
  try {
    return useParentStore((route.meta?.collection || route.params?.collection) as string)
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
    store.filter()
    router.push({ hash: presetName ? `#${presetName}` : '' })
  })(store)
}

watch(route, () => {
  if( !store.value ) {
    return
  }

  return (({ value: store }) => {
    if( store.description.filtersPresets ) {
      if( route.hash ) {
        const presetName = route.hash.slice(1)
        togglePreset(presetName, store.description.filtersPresets[presetName])
        return
      }

      togglePreset('')
    }
  })(store)
}, { immediate: true })
</script>

<style scoped src="./sv-crud-topbar.scss"></style>
