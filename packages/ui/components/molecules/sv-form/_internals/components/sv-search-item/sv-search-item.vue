<template>
  <div class="item">
    <div class="item__values">
      <div
        v-for="(index, idx) in indexes"
        :key="`index-${item._id}-${idx}`"
      >
        {{ item[index] }}
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
type Props = {
  item: any
  indexes: Array<string>
}

const props = defineProps<Props>()
</script>

<style scoped src="./sv-search-item.scss"></style>
