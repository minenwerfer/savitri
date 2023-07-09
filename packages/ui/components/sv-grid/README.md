# sv-grid

## Example

```vue
<template>
  <sv-grid>
    <sv-card
      v-for="index in 12"
      :key="`card-${index}`"
    >
      <sv-picture link="/static/card.svg"></sv-picture>
      <template #footer>
        Card #{{ index }}
      </template>
    </sv-card>

  </sv-grid>
</template>
```
