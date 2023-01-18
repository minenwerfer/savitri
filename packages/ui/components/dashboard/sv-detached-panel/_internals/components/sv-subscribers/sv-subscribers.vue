<template>
  <div>
    <div
      v-for="subscriber in savedItemStore.item.subscribers"
      :key="subscriber._id"
      class="subscribers__picture"
    >
      <sv-user-picture :user="subscriber"></sv-user-picture>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'
import { SvUserPicture } from '../../../../..'

const savedItemStore = useStore('savedItem')
</script>

<style scoped src="./sv-subscribers.scss"></style>
