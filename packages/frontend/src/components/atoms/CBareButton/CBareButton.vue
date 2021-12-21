<template>
  <a
    :class="`
      hover:underline
      inline-block select-none
      ${
        !disabled
          ? 'cursor-pointer'
          : 'cursor-not-allowed opacity-50'
      }
      `"
    @click="onClick"
  >
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'success',
    }
  },

  methods: {
    onClick(event) {
      event.stopPropagation()
      event.preventDefault()

      if( !this.disabled ) {
        this.$emit('clicked', event)
      }
    }
  },
};
</script>
