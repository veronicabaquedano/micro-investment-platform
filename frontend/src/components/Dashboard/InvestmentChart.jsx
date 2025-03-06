import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const InvestmentChart = ({ data }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <p className="text-center text-danger">
        No investment growth data available.
      </p>
    );
  }

  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: "Total Invested",
        data: data.invested || [],
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 1)",
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        borderWidth: 3,
        tension: 0.3,
      },
      {
        label: "Investment Value",
        data: data.growth || [],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        borderWidth: 3,
        tension: 0.3,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Show labels for the two lines
        position: "top",
        labels: {
          color: "#2c3e50", // Dark Blue text
          font: {
            size: 14,
            family: "Fredoka One, cursive",
          },
        },
      },
      tooltip: {
        enabled: true, // Enable tooltips
        callbacks: {
          label: (tooltipItem) => `$${tooltipItem.raw.toFixed(2)}`, // Show exact value with 2 decimal places
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#2c3e50" },
        grid: { color: "rgba(43, 40, 40, 0.16)" },
      },
      y: {
        ticks: { color: "#2c3e50" },
        grid: { color: "rgba(43, 40, 40, 0.16)" },
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default InvestmentChart;
