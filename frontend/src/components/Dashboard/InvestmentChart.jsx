import React from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend);

const InvestmentChart = ({ data }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return <p>No investment growth data available.</p>;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Total Invested",
        data: data.invested,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
      {
        label: "Investment Value",
        data: data.growth,
        backgroundColor: "rgba(255,99,132,0.4)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 2,
      },
    ],
  };
  const options = {
    responsive: true, // Ensures the chart resizes properly
    plugins: {
      legend: {
        display: true, // Ensure legend is enabled
        position: "top",
        labels: {
          font: {
            size: 14, // Increase label size for visibility
          },
          color: "black", // Ensure text color is visible
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default InvestmentChart;
