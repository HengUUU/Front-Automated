import { Chart as ChartJS, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";

ChartJS.register(MatrixController, MatrixElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function HeatmapChart({ report }) {
  // Filter factories with WCI > 0 and sort descending
  const filteredData = report.data
    .filter(f => f.WCI > 0)
    .sort((a, b) => b.WCI - a.WCI);

  const factories = filteredData.map(f => f.station_info.Company);
  const parameters = ["pH", "SS", "COD"];

  const matrixData = [];
  filteredData.forEach((f) => {
    parameters.forEach((param) => {
      matrixData.push({
        x: param,
        y: f.station_info.Company,
        v: f.avg_parame[param.toLowerCase()] ?? 0,
      });
    });
  });

  const chartData = {
    datasets: [
      {
        label: "Water Quality Parameters",
        data: matrixData,
        backgroundColor: (ctx) => {
          const value = ctx.dataset.data[ctx.dataIndex]?.v || 0;
          return `rgba(0, 104, 132, ${Math.min(value / 50, 1)})`; // Blue gradient
        },
        borderColor: "#e5e7eb", // Match border-gray-200
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
            return [`${y}`, `${x}=${v.toFixed(2)}`]; // Factory on first line, param=value on second
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        labels: parameters,
        title: {
          display: true,
          text: "Parameters",
          font: { size: 11 },
          color: "#374151", // Match text-gray-800
          padding: 4,
        },
        ticks: {
          font: { size: 9 },
          color: "#374151",
          maxRotation: 0,
          autoSkip: false,
        },
        grid: { display: false },
        offset: true,
      },
      y: {
        type: "category",
        labels: factories.slice(0, 10), // Limit to 10 factories
        title: {
          display: true,
          text: "Factories",
          font: { size: 11 },
          color: "#374151",
          padding: 4,
        },
        ticks: {
          font: { size: 9 },
          color: "#374151",
          autoSkip: false,
          callback: (value, index) => {
            const maxLength = 15; // Adjust based on space
            const label = factories[index];
            return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
          },
        },
        grid: { display: false },
        offset: true,
      },
    },
    layout: {
      padding: 5, // Maximize chart area
    },
  };

  return (
    <div className="w-full h-full">
      <Chart type="matrix" data={chartData} options={options} />
    </div>
  );
}