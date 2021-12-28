<template>
  <label class="outline-none select-none">
    <div class="opacity-80">
      <slot v-if="$slots.default"></slot>
      <slot v-else name="label"></slot>
    </div>
    <div class="text-sm opacity-50" v-if="$slots.description">
      <slot name="description"></slot>
    </div>
    <input
      class="
        w-full
        border-box rounded
        border border-gray-400
        bg-white
        px-3 py-1
        text-gray-600
      "
      ref="input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
      @change="onChange"

      v-maska="$props.mask"
    />
  </label>
</template>

<script>
import { maska } from "maska";

export default {
  directives: {
    maska
  },

  props: {
    modelValue: {
      default: ''
    },
    type: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      required: false,
    },
    mask: {
      type: String,
      required: false,
    },
  },

  methods: {
    onInput(event) {
      this.$emit("update:modelValue", event.target.value);
    },

    onChange(event) {
      this.$refs.input.value = event.target.value;
    },
  },
};
</script>
