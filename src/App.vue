<script setup>
import { store } from "./store.js";
import HomeView from "./views/HomeView.vue";
import QRCodesView from "./views/QRCodesView.vue";
import ScanningView from "./views/ScanningView.vue";
import SummaryView from "./views/SummaryView.vue";
</script>

<template>
  <SummaryView v-if="store.page === 'summary'" />
  <HomeView v-else-if="store.roster === undefined" />
  <ScanningView v-else-if="store.page === 'scanner'" />
  <QRCodesView v-else />
</template>
