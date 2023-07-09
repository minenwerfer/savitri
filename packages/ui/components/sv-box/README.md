# sv-box

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
  </sv-box>
</template>
```
