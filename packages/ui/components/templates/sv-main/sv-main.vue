<template>
  <div
    id="main"
    :class="`
      main
      main--${metaStore.$theme}
      ${metaStore.$theme === 'dark' && 'tw-dark'}
  `">
    <router-view></router-view>

    <sv-modal
      v-model:visible="metaStore.modal.isVisible"
      v-bind="metaStore.modal"
    >
      <div>
          <p v-if="metaStore.modal.body" v-html="metaStore.modal.body"></p>
          <img v-if="metaStore.modal.image" :src="metaStore.modal.image" />
          <component v-if="metaStore.modal.component" :is="metaStore.modal.component"></component>
      </div>
    </sv-modal>

    <sv-prompt
      v-if="metaStore.prompt.isVisible"
      v-bind="metaStore.prompt"
    >
      {{ metaStore.prompt.body }}
    </sv-prompt>
  </div>

  <div class="main__toasts">
    <sv-toast
      v-for="toast in metaStore.toasts"
      v-bind="toast"
      :key="`toast-${toast.itr}`"
    >
      <div v-html="
      Array.isArray(toast.text)
        ? $t(...toast.text)
        : toast.text
      "></div>
    </sv-toast>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../../../../web'
import { SvModal, SvPrompt, SvToast } from '../../'
import '../../../scss/main.scss'

const metaStore = useStore('meta')
const userStore = useStore('user')
const router = useRouter()

/**
  Updates routes based on global descriptions.
  @see @/../../reusable/organisms/SvMenu/SvMenu.vue
*/
watch(() => metaStore.descriptions, descriptions => {
  if( descriptions?.length === 0 ) return;

  Object.values(descriptions).forEach((description: any) => {
    const routeVisibility = description.route
    if( Array.isArray(routeVisibility) && !routeVisibility.includes(userStore.$currentUser.role)  ) {
      return
    }

    const routeName = `dashboard-${description.collection}`
    if( router.hasRoute(routeName) ) {
      return
    }

    const route = {
      name: routeName,
      path: description.collection,
      redirect: `/dashboard/c/${description.collection}`,
      meta: {
        title: description.collection,
        unicon: description.unicon,
      }
    }

    router.addRoute('dashboard', route)
  })

}, { immediate: true })
</script>

<style scoped src="./sv-main.scss"></style>
