# sv-box

Standardized floating, fixed, and inline panels.

## Props

## Slots

- header: panel header, replaces `title` prop
- footer: fixed panel footer

## Example

```vue
<script setup lang="ts">
const panelVisible = ref(false)
</script>

<template>
  <sv-box
    float
    close-hint
    title="Example"
    v-model="panelVisible"
  >
    This is an example

    <template #footer>
      <sv-button>Ok!</sv-button>
    </template>
  </sv-box>
</template>
```
