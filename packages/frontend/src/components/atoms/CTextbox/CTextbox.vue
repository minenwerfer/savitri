<template>
  <textarea
    class="border border-gray-400 outline-none w-full h-32 px-2 py-1 opacity-80"
    @input="$emit('update:modelValue', $event.target.value)"
  ></textarea>
</template>
