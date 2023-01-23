<template>
  <img
    src="/static/logo.png"
    data-image="logo"

    class="branding"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

type Props = {
  click?: 'homepage' | 'dashboard'
}

const props = defineProps<Props>()
const router = useRouter()

const handleClick = () => {
  if( !props.click ) {
    return
  }

  router.push({
    name: props.click === 'homepage'
      ? 'home'
      : 'dashboard-home'
  })
}
</script>

<style scoped src="./sv-branding.scss"></style>
