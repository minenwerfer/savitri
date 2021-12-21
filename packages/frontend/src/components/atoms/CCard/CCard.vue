<template>
  <a class="border rounded-xl shadow-md overflow-hidden hover:shadow-none transition-all transform hover:translate-y-0.5 bg-white">
    <div class="overflow-hidden">
      <slot name="content"></slot>
    </div>
    <div class="pl-3 py-4" v-if="$slots.title || $slots.description">
      <div class="font-bold">
        <slot name="title"></slot>
      </div>
      <div class="text-sm text-blue-500 py-1" v-if="$slots.description">
        <slot name="description"></slot>
      </div>
    </div>
  </a>
</template>
