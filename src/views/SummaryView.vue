<script setup>
  import { ref } from "vue";
  import Papa from "papaparse";

  const students = ref({}); // uniqueid: { name, presentCount, absentCount, rate, history: [] }
  const stats = ref({ totalDays: 0, avgRate: 0 });
  const pendingFiles = ref([]);
  const isProcessing = ref(false);
  const formVisibile = ref(true);
  const selectedUniqueID = ref(null);

  const onFileSelection = event => {
    pendingFiles.value = Array.from(event.target.files);
  };

  const processFiles = async () => {
    isProcessing.value = true;
    
    const localMap = {};
    const dateSet = new Set();
    let totalPresent = 0;
    let totalRecords = 0;

    const parseFile = file => {
      return new Promise(resolve => {
        Papa.parse(file, {
          header: true, skipEmptyLines: true, dynamicTyping: true,
          complete: results => {
            results.data.forEach(row => {
              const { UniqueID: uniqueID, Name: name, Status: status, Date: date, Time_In: time } = row;
              dateSet.add(date);
              if (!localMap[uniqueID]) {
                localMap[uniqueID] = { uniqueID, name, presentCount: 0, absentCount: 0, excusedCount: 0, history: [] };
              }

              if (status === "Present") {
                localMap[uniqueID].presentCount++;
                totalPresent++;
              } else if (status === "Absent") {
                localMap[uniqueID].absentCount++;
              } else if (status === "Excused") {
                localMap[uniqueID].excusedCount++;
                totalPresent++;
              }
              totalRecords++;

              localMap[uniqueID].history.push({ date, status, time });
            });
            resolve();
          },
        });
      });
    };

    await Promise.all(pendingFiles.value.map(f => parseFile(f)));

    for (const uniqueID in localMap) {
      const student = localMap[uniqueID];
      const total = student.presentCount + student.absentCount + student.excusedCount;
      student.rate = total > 0 ? (((student.presentCount + student.excusedCount) / total) * 100).toFixed(0) : 0;
      student.history.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    students.value = localMap;
    stats.value = { totalDays: dateSet.size, avgRate: totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : 0 };
    isProcessing.value = false;
    formVisibile.value = false;
    pendingFiles.value = [];
  };
</script>

<template>
  <main class="min-h-screen bg-gray-50 p-4 md:p-10 font-sans text-gray-900">
    <header class="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-gray-800 underline decoration-red-500 underline-offset-8">Class Analytics</h1>
        <p class="text-gray-500 mt-3">Attendance Tracking</p>
      </div>
      <!-- Stats -->
      <div v-if="stats.totalDays && stats.avgRate" class="flex gap-4">
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-w-30">
          <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Days</div>
          <div class="text-2xl font-black text-blue-600">{{ stats.totalDays }}</div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-w-30">
          <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Avg. Attendance</div>
          <div class="text-2xl font-black text-blue-600">{{ stats.avgRate }}%</div>
        </div>
      </div>
    </header>
    <section class="max-w-5xl mx-auto mb-8 p-4">
      <form v-if="formVisibile" @submit.prevent="processFiles" class="p-4 border-2 border-dashed border-gray-300 bg-white rounded-2xl text-center">
        <div class="flex flex-col items-center">
          <input type="file" multiple accept=".csv" @change="onFileSelection" class="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          <button type="submit" :disabled="!pendingFiles.length || isProcessing" class="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg transition-all active:scale-95 cursor-pointer">
            {{ isProcessing ? 'Processing Data...' : 'Generate Dashboard' }}
          </button>
        </div>
      </form>
    </section>
    <section v-if="Object.keys(students).length > 0" class="max-w-5xl mx-auto mb-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- Student Table 2/3 width -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
              <th class="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Days</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance Rate</th>
              <th class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <!-- v-for="student in roster" :key="student.id" @click="selectedStudentId = student.id" -->
            <tr v-for="student in students" :key="student.uniqueID" @click="selectedUniqueID = student.uniqueID" class="cursor-pointer group hover:bg-blue-50/40 transition-colors">
              <td class="px-6 py-4">
                <div class="font-bold text-gray-800 group-hover:text-blue-700">{{ student.name }}</div>
                <div class="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{{ student.uniqueID }}</div>
              </td>
              <td class="px-6 py-4 text-center font-bold font-mono text-gray-600">{{ student.presentCount + student.excusedCount }} <span class="text-gray-300 font-normal">/ {{ stats.totalDays }}</span></td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex-1 h-2 bg-gray-100 rounded-full max-w-25">
                    <div class="h-full rounded-full transition-all duration-700" :class="student.rate > 80 ? 'bg-green-500' : 'bg-amber-500'" :style="{ width: student.rate + '%' }"></div>
                  </div>
                  <span class="text-sm font-black text-gray-700">{{ student.rate }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-gray-300 group-hover:text-blue-400 font-black">→</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Student Details 1/3 width -->
      <div class="lg:sticky lg:top-6">
        <div v-if="selectedUniqueID == null" class="p-12 border-2 border-dotted border-gray-200 rounded-2xl text-center grayscale opacity-40 bg-white">
          <p class="text-sm font-bold text-gray-400">Select a student to view history</p>
        </div>
        <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div class="p-6 bg-gray-900 text-white">
            <h2 class="text-xl font-black">{{ students[selectedUniqueID].name }}</h2>
            <div class="flex gap-4 mt-2">
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Present: {{ students[selectedUniqueID].presentCount }}</div>
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Absent: {{ students[selectedUniqueID].absentCount }}</div>
              <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Excused: {{ students[selectedUniqueID].excusedCount }}</div>
            </div>
          </div>

          <div class="p-4 max-h-[60vh] overflow-y-auto bg-gray-50/30">
            <div v-for="entry in students[selectedUniqueID].history" :key="entry.date" class="mb-2 p-3 rounded-xl border bg-white flex items-center justify-between shadow-sm border-gray-100">
              <div class="text-xs font-bold text-gray-600">{{ entry.date }}</div>
              <span :class="{'bg-green-100 text-green-700': entry.status === 'Present', 'bg-red-100 text-red-700': entry.status === 'Absent', 'bg-yellow-100 text-yellow-700': entry.status === 'Excused'}" class="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">{{ entry.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
