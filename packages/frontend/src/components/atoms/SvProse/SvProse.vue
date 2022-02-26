<template>
  <div class="opacity-80 px-4 pt-2 md:px-0 md:pt-0">
    <div v-if="$slots.title" class="text-2xl mb-8">
      <slot name="title"></slot>
    </div>
    <div class="flex flex-col gap-y-6">
      <slot name="body" v-if="$slots.body"></slot>
      <slot v-else></slot>
    </div>
  </div>
</template>
