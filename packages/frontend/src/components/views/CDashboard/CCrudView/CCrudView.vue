<template>
  <c-crud :module="$route.params.module">
  </c-crud>
</template>

<script>
import CCrud from 'frontend/components/templates/CCrud/CCrud.vue'

export default {
  components: {
    CCrud
  },
}
</script>
