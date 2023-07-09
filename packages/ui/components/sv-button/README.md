# sv-button

## Example

```vue
<script setup lang="ts">
const userStore = useStore('user')
</script>

<template>
  <sv-button :loading="userStore.loading.getAll" @click="userStore.getAll">
    Click here
  </sv-button>
</template>
```
