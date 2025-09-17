const fakeData = {
  data: Array.from({ length: 40 }, (_, i) => ({
    avg_parame: Math.random() < 0.1 ? null : {  // 10% chance of null
      ph: +(6 + Math.random() * 3).toFixed(2),
      ss: +(5 + Math.random() * 150).toFixed(2),
      cod: +(30 + Math.random() * 200).toFixed(2),
      waterFlow: -1.0,
      temperature: +(25 + Math.random() * 10).toFixed(2)
    },
    date: "2025-08-20",
    device_ids: `E4:65:B8:29:76:${i.toString().padStart(2, "0")}`,
    station_info: {
      Province: ["KANDAL", "SVAY RIENG", "PHNOM PENH"][i % 3],
      Company: `Factory ${i + 1}`,
      Type: ["Garment", "Department", "Food Processing"][i % 3]
    }
  })),
  total_factories: 40
};


// ✅ Export as default
export default fakeData;
