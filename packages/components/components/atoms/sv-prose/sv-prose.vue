<template>
  <div class="prose">
    <div v-if="$slots.title" class="prose__title">
      <slot name="title"></slot>
    </div>
    <div class="prose__body">
      <slot name="body" v-if="$slots.body"></slot>
      <slot v-else></slot>
    </div>
  </div>
</template>

<style scoped src="./sv-prose.scss"></style>
