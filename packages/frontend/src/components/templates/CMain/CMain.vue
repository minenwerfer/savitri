<template>
  <div class="grid min-h-screen">
    <router-view></router-view>

    <c-modal v-model:visible="modal.isVisible">
      <template #title>{{ modal.title }}</template>
      <template #body>{{ modal.body }}</template>
    </c-modal>

    <c-prompt :actions="prompt.actions" v-if="prompt.isVisible">
      <template #title>{{ prompt.title }}</template>
      <template #body>{{ prompt.body }}</template>
    </c-prompt>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { CModal, CPrompt } from 'frontend/components'

const store = useStore()
const router = useRouter()

const modal = computed(() => store.state.meta.modal)
const prompt = computed(() => store.state.meta.prompt)

/**
  Updates routes based on global descriptions.
  @see @/components/reusable/organisms/CMenu/CMenu.vue
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
        meta: { title: description.module }
      }

      router.addRoute('dashboard', route)
    }
  })

}, { immediate: true })
</script>
