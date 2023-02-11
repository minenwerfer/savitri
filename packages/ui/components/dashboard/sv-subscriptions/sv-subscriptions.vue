<template>
  <div style="
    display: grid;
    grid-template-columns: .5fr 1.5fr;
  ">
    <sv-box>
      <!-- <div class="panel__top"> -->
      <!--   <div -->
      <!--     v-clickable -->
      <!--     @click="subscriptionStore.ask({ action: clearSubscriptions })" -->
      <!--   > -->
      <!--     {{ $t('clear') }} -->
      <!--   </div> -->
      <!--   <sv-icon -->
      <!--     v-clickable -->
      <!--     reactive -->
      <!--     name="multiply" -->
      <!--     @click="closePanel" -->
      <!--   ></sv-icon> -->
      <!-- </div> -->
      <div class="panel__entries">
        <div
          v-for="subscription in subscriptions"
          :key="subscription.identifier"
          class="panel__entry"
        >
          <div class="panel__entry-info">
            <strong>{{ subscription.title }}</strong>
            <div v-if="subscription._id">
              {{ $t('created_by') }}: {{ subscription.owner.full_name }}
            </div>
            <div v-html="subscription.description" class="panel__entry-description"></div>
          </div>

          <div class="panel__entry-options">
            <div
              v-clickable
              @click="goToRoute(subscription.route)"
            >
              {{ $t('visit') }}
            </div>
            <div
              v-clickable
              v-if="subscription._id"
              @click="openSidebar('messages', subscription)"
            >
              {{ $t('messages') }} ({{ subscription.messages.length }})
            </div>
            <div
              v-clickable
              v-if="subscription._id"
              @click="openSidebar('subscribers', subscription)"
            >
              {{ $t('subscribers') }} ({{ subscription.subscribers?.length || 0 }})
            </div>
            <div
              v-clickable
              @click="subscriptionStore.ask({ action: () => closeComponent(subscription) })"
            >
              {{ $t('close') }}
            </div>
          </div>
        </div>
      </div>
    </sv-box>
    <sv-box>
      <component
        fill
        transparent
        no-border
        v-model="item"
        :is="sidebarComponent"
        style="border: 0"
      ></component>
    </sv-box>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, Subscription } from '@savitri/web'
import { SvBox } from '../..'
import SvMessages from '../sv-messages/sv-messages.vue'
import SvSubscribers from './_internals/components/sv-subscribers/sv-subscribers.vue'

const sidebarComponents = {
  messages: SvMessages,
  subscribers: SvSubscribers
}

const router = useRouter()
const subscriptionStore = useStore('subscription')

onMounted(subscriptionStore.getAll)

const sidebarVisible = ref(false)
const sidebarType = ref('')
const sidebarComponent = ref({})
const item = ref<any>({})

const subscriptions = computed(() => {
  return subscriptionStore.items
    .sort((a, b) => a.created_at > b.created_at ? -1 : 1)
})

const closePanel = () => {
  sidebarVisible.value = false
}

const closeComponent = async (subscription: Subscription) => {
  await subscriptionStore.functions.unsubscribe({
    identifier: subscription.identifier
  }, { insert: true })
  closePanel()
}

const clearSubscriptions = async () => {
  await subscriptionStore.functions.clear(null, { insert: true })
  subscriptionStore.clearItems()
  closePanel()
}

const openSidebar = (type: keyof typeof sidebarComponents, subscription: Subscription) => {
  sidebarType.value = type
  sidebarComponent.value = sidebarComponents[type]
  item.value = {
    ...subscription,
    vnode: undefined
  }

  sidebarVisible.value = true
}

const goToRoute = (route: string) => {
  router.push(route)
}

watch(() => subscriptionStore.item, (newItem) => {
  if( newItem._id === item.value._id ) {
    item.value = newItem
  }
}, { deep: true })
</script>

<style scoped src="./sv-subscriptions.scss"></style>
