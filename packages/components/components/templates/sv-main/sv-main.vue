<template>
  <sv-toast v-if="metaStore.toast.isVisible" :key="metaStore.toast.itr">
    {{ metaStore.toast.text }}
  </sv-toast>

  <div class="main">
    <router-view></router-view>

    <sv-modal v-model:visible="metaStore.modal.isVisible" style="z-index: 60">
      <template #title>{{ metaStore.modal.title }}</template>
      <template #body>
        <div class="flex flex-col sm:flex-row justify-between">
            <p v-if="metaStore.modal.body" v-html="metaStore.modal.body" class="opacity-80"></p>
            <img v-if="metaStore.modal.image" :src="metaStore.modal.image" class="w-52 object-contain" />
            <component v-if="metaStore.modal.component" :is="metaStore.modal.component"></component>
        </div>
      </template>
    </sv-modal>

    <sv-prompt :actions="metaStore.prompt.actions" v-if="metaStore.prompt.isVisible">
      <template #title>{{ metaStore.prompt.title }}</template>
      <template #body>{{ metaStore.prompt.body }}</template>
    </sv-prompt>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../../../../web'
import { SvModal, SvPrompt, SvToast } from '../../'

const metaStore = useStore('meta')
const router = useRouter()

/**
  Updates routes based on global descriptions.
  @see @/../../reusable/organisms/SvMenu/SvMenu.vue
*/
watch(() => metaStore.descriptions, descriptions => {
  if( descriptions?.length === 0 ) return;

  Object.values(descriptions).forEach((description: any) => {
    if( description.route ) {
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
    }
  })

}, { immediate: true })
</script>

<style scoped src="./sv-main.scss"></style>
