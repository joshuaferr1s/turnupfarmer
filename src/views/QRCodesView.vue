<script setup>
  import JSZip from "jszip";
  import QRCode from "qrcode";
  import { onMounted, ref } from "vue";
  import { store } from "../store.js";

  const students = ref([]);

  onMounted(async () => {
    for (const uniqueID in store.roster) {
      try {
        students.value.push({ uniqueID, name: store.roster[uniqueID], qrSrc: await QRCode.toDataURL(uniqueID, { width: 400, margin: 1 }) } );
      }
      catch (e) {
        console.error(`Error generating QR for ID ${uniqueID}:`, e);
      }
    }
  });

  const handlePrint = () => {window.print();};

  const handleDownloadQRCodes = async () => {
    const zip = new JSZip();
    const folder = zip.folder("student-qrcodes");

    students.value.forEach(student => {
      if (!student.qrSrc) return;
      const base64Data = student.qrSrc.split(',')[1];
      folder.file(`${student.uniqueID}.png`, base64Data, {base64: true});
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_qr_codes.zip";
    link.click();
  };
</script>

<template>
  <main class="min-h-screen bg-gray-100 p-8 print:min-h-auto print:p-0 print:bg-white">
    <section class="max-w-5xl mx-auto mb-8 flex justify-around items-center print:hidden">
      <button @click="handleDownloadQRCodes" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow transition cursor-pointer">
        Download All
      </button>
      <button @click="handlePrint" class="bg-green-800 hover:bg-green-900 text-white font-medium py-2 px-4 rounded shadow transition cursor-pointer">
        Print QR Codes
      </button>
      <button @click="store.page = 'scanner'" class="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded shadow transition cursor-pointer">
        Return to scanner
      </button>
    </section>
    <section class="max-w-5xl mx-auto grid grid-cols-4 gap-4 print:block print:max-w-none">
      <div v-for="student in students" :key="student.uniqueID" class="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm break-inside-avoid print:w-1/4 print:inline-block print:align-top print:border-gray-300  print:shadow-none print:m-0 print:box-border">
        <div class="mb-3 h-30 w-30 bg-gray-50">
          <img :src="student.qrSrc" alt="Student QR Code" class="w-full h-full object-contain" />
        </div>
        <div class="space-y-1">
          <p class="font-bold text-gray-900 text-sm leading-tight">{{ student.name }}</p>
          <p class="font-mono text-xs text-gray-500">{{ student.uniqueID }}</p>
        </div>
      </div>
    </section>
  </main>
</template>