<script setup>
  import { ref } from "vue";
  import { store } from "../store.js";

  const isDragging = ref(false);

  const handleDrop = event => {
    isDragging.value = false;
    const file = event.dataTransfer.files[0];
    store.processRosterFile(file);
  };

  const handleFileUpload = event => {
    const file = event.target.files[0];
    store.processRosterFile(file);
  };
</script>

<template>
  <section
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    @click="$refs.fileInput.click()"  
    :class="['max-w-5xl mx-auto flex flex-col items-center justify-center p-12 border-4 border-dashed rounded-2xl transition-all duration-300 cursor-pointer', isDragging ? 'border-red-500 bg-red-50 scale-[1.02]' : 'border-gray-200 bg-white hover:border-red-300 hover:bg-slate-50']"
  >
    <div :class="['p-4 rounded-full mb-4 transition-colors', isDragging ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600']"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    </div>
    <h2 class="text-xl font-bold text-gray-800">
      {{ isDragging ? "Drop to Upload" : "Upload Student Roster" }}
    </h2>
    <p class="text-gray-500 mb-6 text-center max-w-xs">
      Drag and drop your <strong>.csv</strong> file here, or click to browse.
    </p>
    <input type="file" ref="fileInput" @change="handleFileUpload" accept=".csv" class="hidden" />
    <div class="text-xs font-medium text-red-600 uppercase tracking-widest">
      Format: ID, Name
    </div>
  </section>
  <code>{{ store.roster }}</code>
</template>