<template>
  <div :class="`
    group
    ${noBorder || 'group--bordered'}
    ${preserveInnerBorders || 'group--no-inner-borders'}
  `">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
type Props = {
  noBorder?: boolean
  preserveInnerBorders?: boolean
}

const props = defineProps<Props>()
</script>

<style scoped src="./sv-group.scss"></style>
