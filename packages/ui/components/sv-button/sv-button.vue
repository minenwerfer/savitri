<script setup lang="ts">
import { inject } from 'vue'
import SvBareButton from '../sv-bare-button/sv-bare-button.vue'
import SvIcon from '../sv-icon/sv-icon.vue'

// #region props
type Size = 
  'small'
  | 'medium'
  | 'large'

type Variant =
  'normal'
  | 'alt'
  | 'transparent'
  | 'brand'

type Props = {
  size?: Size
  small?: boolean
  large?: boolean
  variant?: Variant
  icon?: string
  disabled?: boolean
  loading?: boolean
}
// #endregion props

const props = defineProps<Props>()

const variant = inject('buttonVariant', props.variant) || 'normal'
const size = (() => {
  switch( true ) {
    case props.small: return 'small'
    case props.large: return 'large'
  }

  return inject('buttonSize', props.size) || 'medium'
})()
</script>

<template>
  <sv-bare-button
    :class="`
      button
      button--${variant}
      button--${size}
      ${loading && 'button--loading'}
    `"
    :disabled="disabled"
  >
    <div style="width: 100%">
      <sv-icon
        v-if="icon"
        :name="icon"
        :small="size === 'small'"
        class="button__icon"
      >
        <slot></slot>
      </sv-icon>

      <slot v-else></slot>
    </div>
  </sv-bare-button>
</template>

<style scoped src="./sv-button.scss"></style>

<docs>
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
</docs>
