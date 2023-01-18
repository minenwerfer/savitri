<template>
  <sv-picture
    :url="user.picture?.link"
    class="picture"
  >
    <div>
      <span>{{ user.first_name?.[0] }}</span>
      <span>{{ user.last_name?.[0] }}</span>
    </div>
  </sv-picture>
</template>

<script setup lang="ts">
type Props = {
  user: {
    picture?: {
      link: string
    }
    first_name: string
    last_name: string
  }
}

const props = defineProps<Props>()
</script>

<style scoped src="./sv-user-picture.scss"></style>
