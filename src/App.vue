<script setup>
import { store } from "./store.js";
import HomeView from "./views/HomeView.vue";
import QRCodesView from "./views/QRCodesView.vue";
import ScanningView from "./views/ScanningView.vue";
</script>

<template>
  <HomeView v-if="store.roster === undefined" />
  <ScanningView v-else-if="store.page === 'scanner'" />
  <QRCodesView v-else />
</template>
