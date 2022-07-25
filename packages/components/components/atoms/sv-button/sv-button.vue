<template>
  <sv-bare-button
    :class="`button button--${variant} button--${type}`"
    :disabled="disabled"
  >
    <div class="button__content" v-if="icon">
      <div class="button__icon">
        <sv-icon
          v-if="icon"
          :name="icon"
        ></sv-icon>
      </div>
      <slot></slot>
    </div>

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

interface Props {
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
