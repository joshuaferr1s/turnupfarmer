<script setup>
  defineProps(["error"]);
</script>

<template>
  <Transition name="slide-down" mode="out-in">
    <div v-if="error !== undefined && error !== null" role="alert" class="rounded border-s-4 border-red-500 bg-red-50 p-4">
      <strong class="block font-medium text-red-800">Something went wrong!</strong>
      <p class="mt-2 text-sm text-red-700"><slot>{{ error }}</slot></p>
    </div>
  </Transition>
</template>

<style scoped>
  .slide-down-enter-active, .slide-down-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-down-enter-from {
    opacity: 0;
    transform: translateY(-20px);
  }

  .slide-down-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
</style>
