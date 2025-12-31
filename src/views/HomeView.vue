<script setup>
  import FileUpload from "../components/FileUpload.vue";
</script>

<template>
  <main class="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
    <section class="max-w-5xl mx-auto text-center mb-10">
      <h1 class="text-4xl font-black text-slate-900 tracking-tight">🫜 Turn<span class="text-red-900">up</span> Farmer 🫜</h1>
      <p class="text-gray-500 text-lg">Local-first, FERPA-friendly student check-in.</p>
    </section>
    <FileUpload />
  </main>
</template>