<script setup>
  import { authStore } from "@/stores/authStore.js";
</script>

<template>
  <h2>Dashboard</h2>
  <p>{{ authStore }}</p>
</template>
