<template>
  <div class="tabs">
    <slot></slot>
  </div>
</template>

<style scoped src="./sv-tabs.scss"></style>

<style scoped lang="scss">
:slotted([data-current]) {
  display: flex;
  align-items: center;

  margin-top: 4px;
  padding: 0 .4rem;

}

:slotted([data-current=true]) {
  @include themed() {
    color: #5090fa;
    font-weight: 500;
  }
}
</style>
