import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { Bar } from "react-chartjs-2";

export default function ParamChart({ title, labels, values, color }) {
  const chartRef = useRef(null);

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
    },
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full md:w-1/3 p-3">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
          {title}
        </h2>
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}
