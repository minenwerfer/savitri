# sv-bare-button

## Example

```vue
<script setup lang="ts">
const count = ref(0)
</script>

<template>
  <sv-bare-button
    disabled
    @click="count += 1"
  >
    {{ count }}
  </sv-bare-button>
</template>
```
