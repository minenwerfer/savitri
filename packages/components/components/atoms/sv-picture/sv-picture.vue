<template>
  <div class="picture">
    <img
      v-if="fileLink"
      v-lazy="fileLink"
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
  if( !props.file || (typeof props.file === 'object' && !props.file._id) ) {
    return
  }

  const timestamp = new Date(props.file.last_modified)?.getTime()
    || 'fresh'

  return props.file._id
    ? `${apiUrl}/file/${props.file._id}?${timestamp}`
    : props.file
})
</script>

<style scoped src="./sv-picture.scss"></style>
