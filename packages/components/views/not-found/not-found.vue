<template>
  <div class="notfound">
    <div class="notfound__content">
      <div class="notfound__big">Página não encontrada</div>
      <div
        v-clickable
        class="notfound__back"
        @click="goToMainPage"
      >
        Voltar
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goToMainPage = () => router.push('/')
</script>

<style scoped src="./not-found.scss"></style>
