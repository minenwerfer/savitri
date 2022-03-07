<template>
  <div class="flex flex-col gap-y-4">
    <div class="border-2 border-gray-500 rounded-full w-40 h-40 grid place-items-center self-center overflow-hidden">
      <sv-picture :file="current.picture">
        <template #fallback>
          <unicon name="user" fill="gray" class="w-32 h-32"></unicon>
        </template>
      </sv-picture>
    </div>
    <div class="opacity-80">
      <strong class="text-xl">{{ current.name }}</strong>
      <div>Autenticado como: {{ current.access?.name }}</div>
    </div>

    <div class="flex flex-col gap-y-1">
      <sv-bare-button @clicked="editProfile">Editar perfil</sv-bare-button>
      <sv-bare-button @clicked="signout">Sair</sv-bare-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useModule from 'frontend/composables/module'
import { SvBareButton, SvPicture } from 'frontend/components'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useStore()
const router = useRouter()
const moduleRefs = reactive(useModule('user', store))

const current = computed(() => store.getters['user/current'])

const signout = async () => {
  await store.dispatch('user/signout')
  emit('close')
  router.push({ name: 'signin' })
}

const editProfile = () => {
  emit('close')
  router.push({ name: 'dashboard-user-profile' })
}

const {
  item

} = toRefs(moduleRefs)
</script>
