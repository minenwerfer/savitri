<template>
  <sv-toast v-if="toast.isVisible" :key="toast.itr">
    {{ toast.text }}
  </sv-toast>

  <div class="main">
    <router-view></router-view>

    <sv-modal v-model:visible="modal.isVisible" style="z-index: 60">
      <template #title>{{ modal.title }}</template>
      <template #body>
        <div class="flex flex-col sm:flex-row justify-between">
          <p v-if="modal.body" v-html="modal.body" class="opacity-80"></p>
          <img v-if="modal.image" :src="modal.image" class="w-52 object-contain" />
          <component v-if="modal.component" :is="modal.component"></component>
        </div>
      </template>
    </sv-modal>

    <sv-prompt :actions="prompt.actions" v-if="prompt.isVisible">
      <template #title>{{ prompt.title }}</template>
      <template #body>{{ prompt.body }}</template>
    </sv-prompt>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { SvModal, SvPrompt, SvToast } from '../../'

const store = useStore()
const router = useRouter()

const modal = computed(() => store.state.meta.modal)
const prompt = computed(() => store.state.meta.prompt)
const toast = computed(() => store.state.meta.toast)

/**
  Updates routes based on global descriptions.
  @see @/../../reusable/organisms/SvMenu/SvMenu.vue
*/
watch(() => store.state.meta.globalDescriptions, descriptions => {
  if( descriptions?.length === 0 ) return;

  descriptions.forEach((description: any) => {
    if( description.route ) {

      const name = `dashboard-${description.collection}`
      if( router.hasRoute(name) ) {
        return
      }

      const route = {
        name,
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

const __unused = [
  'col-span-1',
  'col-span-2',
  'col-span-3',
  'col-span-4',
  'col-span-5',
  'col-span-6'
]
</script>

<style scoped src="./sv-main.scss"></style>
