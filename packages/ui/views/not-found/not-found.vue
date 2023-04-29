<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  if( router.options.history.state.back ) {
    router.back()
    return
  }

  router.push('/')
}
</script>

<template>
  <div class="notfound">
    <div class="notfound__content">
      <div class="notfound__big">Página não encontrada</div>
      <div
        v-clickable
        class="notfound__back"
        @click="goBack"
      >
        Voltar
      </div>
    </div>
  </div>
</template>

<style scoped src="./not-found.scss"></style>
