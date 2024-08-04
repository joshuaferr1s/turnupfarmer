<script setup>
  defineProps(["loading"]);
</script>

<template>
  <button type="submit" :disabled="loading" class="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-500/20 disabled:cursor-not-allowed">
    <Transition name="slide-up" mode="out-in">
      <span v-if="loading">Loading</span>
      <span v-else><slot></slot></span>
    </Transition>
  </button>
</template>

<style scoped>
  .slide-up-enter-active, .slide-up-leave-active {
    transition: all 0.25s ease-out;
  }

  .slide-up-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .slide-up-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>
