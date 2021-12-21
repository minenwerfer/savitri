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

<script>
import { watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { CModal, CPrompt } from 'frontend/components'

export default {
  components: {
    CModal,
    CPrompt,
  },

  setup() {
    const store = useStore()
    const router = useRouter()

    /**
      Updates routes based on global descriptions.
      @see @/components/reusable/organisms/CMenu/CMenu.vue
    */
    watch(() => store.state.meta.globalDescriptions, descriptions => {
      if( descriptions?.length === 0 ) return;

      descriptions.forEach((description) => {
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

    return {
      store,
      modal: computed(() => store.state.meta.modal),
      prompt: computed(() => store.state.meta.prompt),
    }
  },
}
</script>
