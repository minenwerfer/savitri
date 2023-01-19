<template>
  <div
    v-if="detachedComponents.length"
    class="panel-container"
    @click="panelVisible = true"
  >
    {{ detachedComponents.length }}
  </div>
  <div
    v-if="panelVisible"
    v-overlay="{
      click: closePanel
    }"
    class="fixed"
  >
    <div 
      v-if="sidebarVisible"
      class="sidebar"
    >
      <sv-icon
        v-clickable
        reactive
        name="multiply"
        @click="sidebarVisible = false"
        style="margin-left: auto"
      ></sv-icon>

      <component
        :is="sidebarComponent"
      ></component>
    </div>

    <div class="panel">
      <div class="panel__top">
        <div v-clickable @click="clearComponents">
          {{ $t('clear') }}
        </div>
        <sv-icon
          v-clickable
          reactive
          name="multiply"
          @click="closePanel"
        ></sv-icon>
      </div>
      <div class="panel__entries">
        <div
          v-for="component in detachedComponents"
          :key="component.identifier"
          class="panel__entry"
        >
          <div class="panel__entry-info">
            <strong>{{ component.title }}</strong>
            <div v-if="component._id">
              {{ $t('created_by') }}: {{ component.owner.full_name }}
            </div>
            <div v-html="component.description" class="panel__entry-description"></div>
          </div>

          <div class="panel__entry-options">
            <div v-clickable v-if="component.vnode" @click="toggleComponent(component)">
              {{ $t(component.visible === true ? 'shrink' : 'restore') }}
            </div>
            <div v-clickable @click="closeComponent(component)">
              {{ $t('close') }}
            </div>
            <div v-clickable @click="goToRoute(component.route)">
              {{ $t('visit') }}
            </div>
            <div v-clickable v-if="component._id" @click="openSidebar('messages', component)">
              {{ $t('messages') }} ({{ component.messages.length }})
            </div>
            <div v-clickable v-if="component._id" @click="openSidebar('subscribers', component)">
              {{ $t('subscribers') }} ({{ component.subscribers.length }})
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, DetachedComponent } from '@savitri/web'
import { SvIcon } from '../..'
import SvMessages from './_internals/components/sv-messages.vue'
import SvSubscribers from './_internals/components/sv-subscribers/sv-subscribers.vue'

const sidebarComponents = {
  messages: SvMessages,
  subscribers: SvSubscribers
}

const router = useRouter()
const metaStore = useStore('meta')
const savedItemStore = useStore('savedItem')

const panelVisible = ref(false)
const sidebarVisible = ref(false)
const sidebarComponent = ref({})
const detachedComponents = computed(() => metaStore.detachedComponents.filter(component => component.visible))

onMounted(async () => {
  metaStore.detached = (await savedItemStore.getAll()).reduce((a, item) => ({
    ...a,
    [item.identifier]: {
      ...item,
      visible: 'shrink'
    }
  }), {})
})

const toggleComponent = (component: DetachedComponent) => {
  if( component.visible === true ) {
    component.visible = 'shrink'
    return
  }

  component.visible = true
  metaStore.detachedStack.unshift(component.vnode.props.uid)
}

const closeComponent = (component: DetachedComponent) => {
  component.visible = false
  savedItemStore.functions.unsubscribe({
    identifier: component.identifier
  })
}

const closePanel = () => {
  panelVisible.value = false
  sidebarVisible.value = false
}

const clearComponents = () => {
  Object.keys(metaStore.detached).forEach((key) => {
    metaStore.detached[key].visible = false
  })

  metaStore.detachedStack.splice(0)
  metaStore.detachedItr = Math.random()
  savedItemStore.functions.clear()

  closePanel()
}

const openSidebar = (type: keyof typeof sidebarComponents, component: DetachedComponent) => {
  sidebarComponent.value = sidebarComponents[type]
  savedItemStore.setItem({
    ...component,
    vnode: undefined
  })
  sidebarVisible.value = true
}

const goToRoute = (route: string) => {
  router.push(route)
  panelVisible.value = false
}
</script>

<style scoped src="./sv-detached-panel.scss"></style>
