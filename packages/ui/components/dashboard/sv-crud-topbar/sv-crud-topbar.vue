<template>
  <div class="topbar">
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
    </sv-tabs>

    <div class="topbar__controls">
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

        @click="call(actionProps)({ _id: selectedIds })"
      >
        {{
          actionProps.translate
            ? $t(actionProps.name)
            : actionProps.name
        }}
      </sv-button>
      <slot v-if="$slots.actions" name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { FiltersPreset } from '@semantic-api/types'
import { useRouter, useParentStore } from '@savitri/web'
import { call } from '../../sv-crud/_internals/store'
import SvTabs from '../../sv-tabs/sv-tabs.vue'
import SvButton from '../../sv-button/sv-button.vue'
import SvIcon from '../../sv-icon/sv-icon.vue'

const router = await useRouter()
const route = router.currentRoute

const store = computed(() => {
  try {
    return useParentStore((route.value.meta?.collection || route.value.params?.collection) as string)
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
      if( route.value.hash ) {
        const presetName = route.value.hash.slice(1)
        togglePreset(presetName, store.description.filtersPresets[presetName])
        return
      }

      togglePreset('')
    }
  })(store)
}, { immediate: true })
</script>

<style scoped src="./sv-crud-topbar.scss"></style>
