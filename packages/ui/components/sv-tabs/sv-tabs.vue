<template>
  <div class="tabs">
    <slot></slot>
  </div>
</template>

<style scoped src="./sv-tabs.scss"></style>

<style scoped lang="scss">
:slotted(div) {
  display: flex;
  align-items: center;

  margin-top: 4px;
  border-bottom: 4px solid transparent;
  padding: 0 .4rem;
  font-size: small;

}

:slotted([data-current=true]) {
  @include themed() {
    border-bottom: 4px solid t(brand-color);
  }
}
</style>
