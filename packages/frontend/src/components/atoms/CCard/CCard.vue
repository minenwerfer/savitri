<template>
  <a :class="`
    block overflow-hidden bg-white
    border rounded-xl shadow-md
    ${ disabled ? 'filter grayscale' : 'transition-all transform hover:translate-y-0.5 hover:shadow-none' }
  `">
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

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
