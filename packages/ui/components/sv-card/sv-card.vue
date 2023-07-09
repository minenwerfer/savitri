<template>
  <div class="card">
    <div class="card__picture">
      <slot></slot>
    </div>

    <div class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped src="./sv-card.scss"></style>
