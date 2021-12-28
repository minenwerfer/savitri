<template>
  <div
    class="
    checkbox
    rounded
    bg-white
    py-2
    border
    flex
    items-center
    select-none
    "
    >
    <div class="px-2 w-8">
      <input
        ref="checkbox"
        type="checkbox"
        v-model="bindVal"
        @input="onInput"
        />
    </div>
    <div
      class="grid w-full border-l px-4 cursor-pointer"
      @click="onClick"
      >
      <div class="">
        <slot name="label" v-if="$slots.label"></slot>
      </div>
      <div class="opacity-80">
        <slot name="description" v-if="$slots.description"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Boolean],
      required: false,
    },
    array: {
      type: Boolean,
      default: false,
    },
    isRadio: {
      type: Boolean,
      default: false,
    }
  },

  methods: {
    onClick() {
      if (!this.required) {
        this.$refs.checkbox.click();
      }
    },
  },

  mounted() {
    if( !this.modelValue ) {
      this.$emit('update:modelValue', this.array ? [] : false)
    }
  },

  computed: {
    bindVal: {
      get() {
        if( this.isRadio ) {
          return this.modelValue === this.value
        }

        return Array.isArray(this.modelValue)
          ? this.modelValue.includes(this.value)
          : !!this.value
      },

      set() {
        if( this.isRadio ) {
          this.$emit('update:modelValue', this.value)
          return
        }

        if( this.array || Array.isArray(this.modelValue) ) {
          this.$emit('update:modelValue', !this.modelValue.includes(this.value)
            ? [ ...this.modelValue||[], this.value ]
            : this.modelValue.filter((v) => v !== this.value))
        } else {
          this.$emit('update:modelValue', !(this.modelValue === true))
        }
      }
    }
  },
};
</script>
