<template>
  <div :key="file" class="picture">
    <img
      v-if="fileLink"
      :src="fileLink"
      class="picture__image"
    />

    <slot v-else-if="$slots.fallback" name="fallback"></slot>
    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHttp } from '../../../../web'

type Props = {
  file: any
}

const props = defineProps<Props>()
const { apiUrl } = useHttp()

const fileLink = computed(() => {
  if( typeof props.file === 'object' && !props.file?._id ) {
    return
  }

  return props.file._id
    ? `${apiUrl}/file/${props.file._id}`
    : props.file
})
</script>

<style scoped src="./sv-picture.scss"></style>
