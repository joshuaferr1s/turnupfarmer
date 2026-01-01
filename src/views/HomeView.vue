<script setup>
  import { store } from "../store.js";
  import FileUpload from "../components/FileUpload.vue";
</script>

<template>
  <main class="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
    <section class="max-w-5xl mx-auto text-center mb-10">
      <h1 class="text-4xl font-black text-slate-900 tracking-tight">🫜 Turn<span class="text-red-900">up</span> Farmer 🫜</h1>
      <p class="text-gray-500 text-lg">Local-first, FERPA-friendly student check-in.</p>
    </section>
    <FileUpload />
    <section class="max-w-5xl mx-auto text-center mt-10">
      <button @click="store.page = 'summary'" class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition-all cursor-pointer">
        Summarize Attendance Records
      </button>
    </section>
  </main>
</template>