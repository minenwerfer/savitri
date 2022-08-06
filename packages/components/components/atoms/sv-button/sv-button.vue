<template>
  <sv-bare-button
    :class="`button button--${variant} button--${type}`"
    :disabled="disabled"
  >
    <sv-icon
      v-if="icon"
      :name="icon"
      class="button__icon"
    >
      <slot></slot>
    </sv-icon>

    <slot v-else></slot>
  </sv-bare-button>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import {
  SvBareButton,
  SvIcon

} from '..'

// #region props
type Type = 
  'neutral'
  | 'success'
  | 'critical'

type Variant =
  'normal'
  | 'light'

type Props = {
  type?: Type
  variant?: Variant
  icon?: string
  disabled?: boolean
}
// #endregion props

const props = defineProps<Props>()

const variant = inject('buttonVariant', props.variant) || 'normal'
const type = props.type || 'success'
</script>

<style scoped src="./sv-button.scss"></style>
