<template>
  <div
    v-if="subscriptionStore.itemsCount > 0"
    class="panel-container"
    @click="panelVisible = true"
  >
    {{ subscriptionStore.itemsCount }}
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
      <div class="sidebar__header">
        <div>{{ $t(sidebarType) }}</div>
        <sv-icon
          v-clickable
          reactive
          name="multiply"
          @click="sidebarVisible = false"
        ></sv-icon>
      </div>
      <component
        fill
        transparent
        no-border
        v-model="subscriptionStore.item"
        :is="sidebarComponent"
        style="border: 0"
      ></component>
    </div>

    <div class="panel">
      <div class="panel__top">
        <div
          v-clickable
          @click="subscriptionStore.ask({ action: clearComponents })"
        >
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
          v-for="component in subscriptionStore.items"
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
            <div
              v-clickable
              @click="goToRoute(component.route)"
            >
              {{ $t('visit') }}
            </div>
            <div
              v-clickable
              v-if="component._id"
              @click="openSidebar('messages', component)"
            >
              {{ $t('messages') }} ({{ component.messages.length }})
            </div>
            <div
              v-clickable
              v-if="component._id"
              @click="openSidebar('subscribers', component)"
            >
              {{ $t('subscribers') }} ({{ component.subscribers?.length || 0 }})
            </div>
            <div
              v-clickable
              @click="subscriptionStore.ask({ action: () => closeComponent(component) })"
            >
              {{ $t('close') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, DetachedComponent } from '@savitri/web'
import { SvIcon } from '../..'
import SvMessages from '../sv-messages/sv-messages.vue'
import SvSubscribers from './_internals/components/sv-subscribers/sv-subscribers.vue'

const sidebarComponents = {
  messages: SvMessages,
  subscribers: SvSubscribers
}

const router = useRouter()
const subscriptionStore = useStore('subscription')

onMounted(subscriptionStore.getAll)

const panelVisible = ref(false)
const sidebarVisible = ref(false)
const sidebarType = ref('')
const sidebarComponent = ref({})

const closePanel = () => {
  panelVisible.value = false
  sidebarVisible.value = false
}

const closeComponent = async (component: DetachedComponent) => {
  await subscriptionStore.functions.unsubscribe({
    identifier: component.identifier
  })
  closePanel()
}

const clearComponents = async () => {
  await subscriptionStore.functions.clear()
  subscriptionStore.clearItems()
  closePanel()
}

const openSidebar = (type: keyof typeof sidebarComponents, component: DetachedComponent) => {
  sidebarType.value = type
  sidebarComponent.value = sidebarComponents[type]
  subscriptionStore.setItem({
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

<style scoped src="./sv-subscriptions.scss"></style>
