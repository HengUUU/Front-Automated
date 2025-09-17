import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ParamChart({ title, labels, values, color }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: color,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { beginAtZero: true },
      y: {
        ticks: {
          align: "start",          // align text to start
          maxRotation: 0,          // prevent rotation
          minRotation: 0,
          callback: function(value) {
            // show the start of the label
            return this.getLabelForValue(value);
          },
        },
      },
    },
  };

  return (
    <div className="w-full md:w-1/3 p-3">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
          {title}
        </h2>
        <Bar data={data} options={options} className="text-start"/>
      </div>
    </div>
  );
}