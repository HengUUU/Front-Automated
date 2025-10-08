import { Chart as ChartJS, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";

ChartJS.register(MatrixController, MatrixElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function HeatmapChart({ report }) {
  const filteredData = report.data
    .filter(f => f.WCI != null)
    .sort((a, b) => a.WCI - b.WCI)
    .slice(0, 10); // Top 10 worst

  const factories = filteredData.map(f => f.station_info.Company);
  const parameters = ["pH", "SS", "COD"];

  // Compute min/max per parameter (column)
  const columnStats = {};
  parameters.forEach(param => {
    const values = filteredData.map(f => f.avg_parame[param.toLowerCase()] ?? 0);
    columnStats[param] = {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  });

  // Build matrix data with normalized value per column
  const matrixData = [];
  filteredData.forEach((f) => {
    parameters.forEach((param) => {
      const val = f.avg_parame[param.toLowerCase()] ?? 0;
      const { min, max } = columnStats[param];
      // Normalize: 0 = min, 1 = max
      const normalized = max === min ? 0.5 : (val - min) / (max - min);
      matrixData.push({
        x: param,
        y: f.station_info.Company,
        v: val,
        normalized,
      });
    });
  });

  const chartData = {
    datasets: [
      {
        label: "Water Quality Parameters",
        data: matrixData,
        backgroundColor: (ctx) => {
          const normalized = ctx.dataset.data[ctx.dataIndex]?.normalized || 0;
          // Map 0 (lowest value) → light, 1 (highest value) → dark
          return `rgba(0, 104, 132, ${0.3 + 0.7 * normalized})`;
        },
        borderColor: "#e5e7eb",
        borderWidth: 1,
        width: ({ chart }) => (chart.chartArea?.width || 350) / parameters.length - 1,
        height: ({ chart }) => (chart.chartArea?.height || 250) / Math.min(factories.length, 10) - 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const { x, y, v } = context.raw;
            return [`${y}`, `${x}=${v.toFixed(2)}`];
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        labels: parameters,
        title: { display: true, text: "Parameters", font: { size: 11 }, color: "#374151", padding: 4 },
        ticks: { font: { size: 9 }, color: "#374151", maxRotation: 0, autoSkip: false },
        grid: { display: false },
        offset: true,
      },
      y: {
        type: "category",
        labels: factories,
        reverse: false,
        title: { display: true, text: "Factories", font: { size: 11 }, color: "#374151", padding: 4 },
        ticks: {
          font: { size: 9 },
          color: "#374151",
          autoSkip: false,
          callback: (value, index) => {
            const maxLength = 15;
            const label = factories[index];
            return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
          },
        },
        grid: { display: false },
        offset: true,
      },
    },
    layout: { padding: 5 },
  };

  return (
    <div className="w-full h-full">
      <Chart type="matrix" data={chartData} options={options} />
    </div>
  );
}
