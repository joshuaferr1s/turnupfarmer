import { reactive } from "vue";

export const store = reactive({
  roster: undefined,
  page: "scanner", // scanner | generator | summary
  clearRoster() {
    if (confirm("Are you sure? This will clear all current attendance data.")) {
      this.roster = undefined;
    }
  },
  processRosterFile(file) {
    if (!file || (file.type !== "text/csv" && !file.name.endsWith(".csv"))) {
      alert("Please upload a valid CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const roster = {};
      const lines = e.target.result.split("\n");
      lines.forEach(line => {
        const [id, name] = line.split(",").map(s => s?.trim());
        if (id && name) roster[id] = name;
      });
      this.roster = roster;
    };
    reader.readAsText(file);
  },
});
