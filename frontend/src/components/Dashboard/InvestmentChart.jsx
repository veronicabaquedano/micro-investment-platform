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
  const chartRef = useRef(null);
  console.log("Chart Data Inside InvestmentChart.jsx:", data); //debugging
  useEffect(() => {
    if (!data || !data.labels || data.labels.length === 0) return;

    const chart = chartRef.current;
    if (!chart) return;

    const ctx = chart.ctx;
    if (!ctx) return;

    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.5)"); // Light Green (Top)
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.5)"); // Light Blue (Bottom)

    //Check again before applying gradient
    if (data.datasets && Array.isArray(data.datasets)) {
      data.datasets.forEach((dataset) => {
        dataset.backgroundColor = gradient;
      });
    }
  }, [data]);

  if (
    !data ||
    !Array.isArray(data.labels) ||
    !Array.isArray(data.datasets) ||
    data.datasets.length === 0
  ) {
    return (
      <p className="text-center text-danger">
        No investment growth data available.
      </p>
    );
  }
  const chartData = {
    labels: data.labels || [],
    datasets: data.datasets || [],
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
          label: function (tooltipItem) {
            return `$${tooltipItem.raw.toFixed(2)}`; // Show exact value with 2 decimal places
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#2c3e50", // Dark Blue x-axis labels
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
      },
      y: {
        ticks: {
          color: "#2c3e50", // Dark Blue y-axis labels
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
      },
    },
  };

  return (
    <>
      <Line
        ref={chartRef}
        data={chartData}
        options={options}
        height={400}
        width={800}
      />
    </>
  );
};

export default InvestmentChart;
