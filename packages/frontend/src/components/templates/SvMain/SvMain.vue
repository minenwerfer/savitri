<template>

  <sv-toast v-if="toast.isVisible" :key="toast.itr">
    {{ toast.text }}
  </sv-toast>

  <div class="grid min-h-screen">
    <router-view></router-view>

    <sv-modal v-model:visible="modal.isVisible" class="z-50">
      <template #title>{{ modal.title }}</template>
      <template #body>
        <div class="flex flex-col sm:flex-row justify-between">
          <p v-html="modal.body"></p>
          <img v-if="modal.image" :src="modal.image" class="w-52 object-contain" />
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
import { SvModal, SvPrompt, SvToast } from 'frontend/components'

const store = useStore()
const router = useRouter()

const modal = computed(() => store.state.meta.modal)
const prompt = computed(() => store.state.meta.prompt)
const toast = computed(() => store.state.meta.toast)

/**
  Updates routes based on global descriptions.
  @see @/components/reusable/organisms/SvMenu/SvMenu.vue
*/
watch(() => store.state.meta.globalDescriptions, descriptions => {
  if( descriptions?.length === 0 ) return;

  descriptions.forEach((description: any) => {
    if( description.route ) {

      const name = `dashboard-${description.module}`
      if( router.hasRoute(name) ) {
        return
      }

      const route = {
        name,
        path: description.module,
        redirect: `/dashboard/c/${description.module}`,
        meta: {
          title: description.module,
          unicon: description.unicon,
        }
      }

      router.addRoute('dashboard', route)
    }
  })

}, { immediate: true })
</script>
