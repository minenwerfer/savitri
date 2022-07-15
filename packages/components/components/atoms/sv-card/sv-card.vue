<template>
  <a :class="`card ${disabled && 'card--disabled'}`">
    <div class="card__content">
      <slot name="content"></slot>
    </div>
    <div class="card__bottom" v-if="$slots.bottom">
      <slot name="bottom"></slot>
    </div>
  </a>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const props = defineProps<Props>()
</script>

<style scoped src="./sv-card.scss"></style>
