<template>
  <c-bare-button
    :class="`
      text-white text-center font-bold
      py-2 px-4
      rounded-md bg-${type}-500 border-b-2 border-${type}-700
    `"
  >
    <slot></slot>
  </c-bare-button>
</template>

<script>
import { CBareButton } from '..'

export default {
  components: {
    CBareButton
  },

  props: {
    type: {
      type: String,
      default: 'success',
    }
  },
};
</script>

<style scoped>
@layer hover {
  .underline {
    text-decoration: none;
  }
}
</style>
