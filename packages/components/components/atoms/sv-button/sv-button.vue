<template>
  <sv-bare-button
    :class="`
      button
      button--${variant}
      button--${size}
    `"
    :disabled="disabled"
  >
    <div style="width: 100%">
      <sv-icon
        v-if="icon"
        :name="icon"
        :reactive="false"
        class="button__icon"
      >
        <slot></slot>
      </sv-icon>

      <slot v-else></slot>
    </div>
  </sv-bare-button>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import {
  SvBareButton,
  SvIcon

} from '..'

// #region props
type Size = 
  'small'
  | 'medium'
  | 'large'

type Variant =
  'normal'
  | 'alt'
  | 'transparent'

type Props = {
  size?: Size
  variant?: Variant
  icon?: string
  disabled?: boolean
}
// #endregion props

const props = defineProps<Props>()

const variant = inject('buttonVariant', props.variant) || 'normal'
const size = inject('buttonSize', props.size) || 'medium'
</script>

<style scoped src="./sv-button.scss"></style>
