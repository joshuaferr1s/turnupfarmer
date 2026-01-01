<script setup>
  import { computed, onMounted, onUnmounted, ref } from "vue";
  import { store } from "../store.js";

  const displayList = ref([]);
  let focusTimer = null;
  const scanField = ref(null);
  const scanInput = ref("");
  const scanStatus = ref({ type: "idle", message: "Ready to Scan" });
  const scannedStudents = ref({}); // { id: timestamp }

  // Computed Values
  const recentScans = computed(() => displayList.value.slice(0, 5));
  const presentCount = computed(() => Object.keys(scannedStudents.value).length);
  const totalCount = computed(() => Object.keys(store.roster).length);

  // Auto-focus for the scanning input field
  const ensureFocus = () => { if (scanField.value) scanField.value.focus(); };
  onMounted(() => {
    ensureFocus();
    window.addEventListener("click", () => {
      clearTimeout(focusTimer);
      focusTimer = setTimeout(ensureFocus, 3000); // Refocus after 3 seconds
    });
  });
  onUnmounted(() => {
    window.removeEventListener("click", ensureFocus);
    clearTimeout(focusTimer);
  });

  // Scan processing function
  const processScan = () => {
    const uniqueID = scanInput.value.trim();
    scanInput.value = ""; // Clear input to avoid lingering data

    if (!uniqueID) return;
    if (store.roster[uniqueID] == undefined) {
      scanStatus.value = { type: "error", message: `ID ${uniqueID} not found.` };
      return;
    }

    const name = store.roster[uniqueID];
    // Check if the uniqueID has been checked in already and return an error if so
    if (scannedStudents.value[uniqueID] != undefined) {
      scanStatus.value = { type: "warning", message: `Already Scanned: ${name} @ ${scannedStudents.value[uniqueID]}.` };
      return;
    }
    
    // Success and log the attendance record
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    scannedStudents.value[uniqueID] = time;
    displayList.value.unshift({ uniqueID, name, time });
    scanStatus.value = { type: "success", message: `Scanned: ${name}.` };
  };

  // Remove a student attendance record
  const removeEntry = uniqueID => {
    delete scannedStudents.value[uniqueID];
    displayList.value = displayList.value.filter(e => e.uniqueID !== uniqueID);
  };

  // Export full attendance as CSV
  const exportFinalAttendance = () => {
    const date = new Date().toLocaleDateString("en-CA");
    let csv = "UniqueID,Name,Status,Time_In,Date\n";

    Object.entries(store.roster).forEach(([uniqueID, name]) => {
      const time = scannedStudents.value[uniqueID] || "";
      csv += `${uniqueID},"${name}",${time ? "Present" : "Absent"},${time},${date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_${date}.csv`;
    link.click();
  };

  const SCAN_STATUS_STYLES = {
    idle: "bg-white border-slate-200 text-slate-400",
    success: "bg-emerald-50 border-emerald-500 text-emerald-700",
    error: "bg-rose-50 border-rose-500 text-rose-700",
    warning: "bg-amber-50 border-amber-500 text-amber-700",
  };
</script>

<template>
  <main class="min-h-screen bg-gray-50 p-4 md:p-10 font-sans space-y-6">
    <!-- Numerical Overview Information -->
    <section class="grid grid-cols-2 gap-4">
      <div class="bg-green-50 p-4 rounded-xl border border-green-100">
        <p class="text-green-600 text-sm font-semibold uppercase tracking-wider">Present</p>
        <p class="text-3xl font-black text-green-900">{{ presentCount }}</p>
      </div>
      <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <p class="text-blue-500 text-sm font-semibold uppercase tracking-wider">Total Roster</p>
        <p class="text-3xl font-black text-blue-900">{{ totalCount }}</p>
      </div>
    </section>

    <!-- Scanning & Stautus Portal -->
    <section class="p-8 rounded-2xl border-2 transition-all duration-500 text-center" :class="SCAN_STATUS_STYLES[scanStatus.type]">
      <h2 class="text-xl font-bold mb-4">{{ scanStatus.message }}</h2>
      <div class="relative max-w-sm mx-auto">
        <input ref="scanField" v-model="scanInput" @keyup.enter="processScan" type="text" placeholder="Awaiting scan..." class="w-full pl-10 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-xl text-center font-mono outline-none transition-all" />
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </span>
      </div>
    </section>

    <!-- Recent Scans -->
    <section v-if="recentScans.length > 0" class="flex flex-wrap justify-center gap-2 animate-in fade-in duration-700">
      <h2 class="text-xl font-bold text-slate-400 w-full text-center mb-1">Recent Activity</h2>
      <div v-for="student in recentScans" :key="student.uniqueID" class="bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm flex items-center space-x-2 animate-in slide-in-from-left-2">
        <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
        <div class="flex flex-col">
          <span class="text-sm font-medium text-slate-700">{{ student.name }}</span>
          <span class="text-[10px] text-slate-400 font-mono">{{ student.time }}</span>
        </div>
      </div>
    </section>

    <!-- Scanned List -->
    <section class="bg-white rounded-xl border border-slate-200">
      <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h2 class="text-xl font-bold text-slate-400">Scanned Students</h2>
        <button @click="exportFinalAttendance" class="px-3 py-1 rounded-md text-sm font-bold text-blue-600 hover:bg-blue-100 hover:text-blue-800 cursor-pointer">Export Full Report (.csv)</button>
      </div>
      <table class="w-full text-left border-collapse">
        <tbody class="divide-y divide-slate-50">
          <tr v-if="displayList.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">No one has checked in yet today.</td>
          </tr>
          <tr v-for="student in displayList" :key="student.uniqueID" class="hover:bg-slate-50 transition-colors group">
            <td class="px-6 py-4 font-mono text-sm text-slate-400">{{ student.uniqueID }}</td>
            <td class="px-6 py-4 font-semibold text-sm text-slate-700">{{ student.name }}</td>
            <td class="px-6 py-4 font-mono text-sm text-slate-500">{{ student.time }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="removeEntry(student.uniqueID)" class="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 text-xs font-bold uppercase tracking-tighter transition-all">Undo</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
  <footer class="bg-gray-50 p-4 md:p-10 font-sans space-y-6">
    <!-- Clear & Reset -->
    <section class="px-6 py-4 bg-white rounded-xl border border-slate-200 flex flex-row justify-between items-center">
      <button @click="store.page = 'generator'" class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition-all cursor-pointer">
        QR Code Generator
      </button>
      <button @click="store.clearRoster" class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded transition-all cursor-pointer">
        Clear & Reset Roster
      </button>
    </section>
  </footer>
</template>