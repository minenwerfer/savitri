<script setup lang="ts">
import { useRouter, useNavbar, Route, MenuSchema } from '@savitri/web'
import SvIcon from '../../sv-icon/sv-icon.vue'
import SvNavbarHeader from './_internals/components/sv-navbar-header/sv-navbar-header.vue'

type Props = {
  entrypoint?: string
  visible: boolean
  mobileVisible?: boolean
  schema: MenuSchema
}

type SchemaNode = {
  roles?: Array<string>
  children?: Route
}

type Emit = {
  (e: 'update:visible' | 'update:mobileVisible', value: string|boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const router = await useRouter()

const onEntryClick = (route: Route & { meta: any }) => {
  if( route.name ) {
    router.push({ name: route.name })
  }
  if( route.meta?.action ) {
    route.meta.action()
  }

  if( props.mobileVisible ) {
    emit('update:mobileVisible', false)
  }
}

const {
  isCurrent,
  routes,
  routesWithChildren

} = await useNavbar(props)
</script>

<template>
  <div
    :key="mobileVisible"
    v-overlay="{
      condition: mobileVisible,
      click: () => emit('update:mobileVisible', false)
    }"
    :class="`
      navbar
      no-print
      ${!visible && 'navbar--hidden'}
      ${mobileVisible && 'navbar--mobile-visible'}
  `">
    <sv-navbar-header class="navbar__header"></sv-navbar-header>

    <div v-if="$slots['navbar-action']" class="navbar__action">
      <slot name="navbar-action"></slot>
    </div>
    <!-- navbar entries -->
    <div class="navbar__entries">
      <div
        v-for="(entry, index) in routesWithChildren"
        :key="`entry-${index}`"
        class="navbar__entry"
      >
        <!-- subroutes -->
        <sv-icon
          v-clickable
          v-for="route in entry.children"
          :key="route.name"
          :class="`
            navbar__route
            ${isCurrent(route) && 'navbar__route--current'}
          `"

          :name="route.meta?.icon || 'file'"
          :title="$tc(route.meta.title || 'untitled', 2)"
          @click="onEntryClick(route)"
        >
          <span>{{ $tc(route.meta.title || 'untitled', 2) }}</span>
          <span v-if="route.badgeFunction">
            ({{
              useStore(route.badgeFunction.split('@')[0])
                .customGetter[route.badgeFunction.split('@')[1]]('navbar', route.badgePayload)
            }})
          </span>
        </sv-icon>
      </div>
    </div>

    <div v-if="$slots['navbar-bottom']" class="navbar__bottom">
      <slot name="navbar-bottom"></slot>
    </div>
  </div>
</template>

<style scoped src="./sv-navbar.scss"></style>
