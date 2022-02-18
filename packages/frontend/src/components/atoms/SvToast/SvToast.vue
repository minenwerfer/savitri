<template>
  <teleport to="body">
    <div class="fixed inset-0 w-screen h-screen bg-white p-8 z-50 animate-fadeout">
      <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="text-2xl font-bold uppercase">
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
