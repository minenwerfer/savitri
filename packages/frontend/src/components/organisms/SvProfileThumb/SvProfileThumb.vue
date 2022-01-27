<template>
  <sv-dropdown ref="dropdown">
    <template #trigger>
      <unicon name="user-circle" fill="black" class="w-6 h-6"></unicon>
    </template>
    <template #content>
      <teleport to="body">
        <div class="fixed inset-0 bg-gray-600 opacity-40 z-40" @click="dropdown.visible = false"></div>

        <sv-box class="fixed top-4 right-6 shadow-xl w-90 z-50">
          <div class="flex flex-col items-start gap-y-2">
            <!-- <sv-bare-button>Meu perfil</sv-bare-button> -->
            <sv-bare-button @clicked="signout">Sair</sv-bare-button>
          </div>
        </sv-box>
      </teleport>
    </template>
  </sv-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useModule from 'frontend/composables/module'
import { SvBox, SvDropdown, SvBareButton } from 'frontend/components'

const dropdown = ref(null)

const store = useStore()
const router = useRouter()

const signout = async () => {
  await store.dispatch('user/signout')
  router.push({ name: 'signin' })
}
</script>
