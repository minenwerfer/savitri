<template>
  <div class="flex flex-col gap-y-4">
    <div class="border-4 border-gray-600 rounded-full w-36 h-36 grid place-items-center self-center">
      <unicon name="user" fill="gray" class="w-32 h-32"></unicon>
    </div>
    <div class="opacity-80">
      <strong class="text-xl">{{ current.name }}</strong>
      <div>Autenticado como: {{ current.access?.name }}</div>
    </div>

    <div>
      <sv-bare-button @clicked="signout">Sair</sv-bare-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import useModule from 'frontend/composables/module'
import { SvBareButton } from 'frontend/components'

const store = useStore()
const router = useRouter()
const moduleRefs = reactive(useModule('user', store))

const signout = async () => {
  await store.dispatch('user/signout')
  router.push({ name: 'signin' })
}

const current = computed(() => store.state.user.current)

const {
  item

} = toRefs(moduleRefs)
</script>
