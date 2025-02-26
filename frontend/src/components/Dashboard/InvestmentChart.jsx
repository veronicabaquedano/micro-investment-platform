import React from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const InvestmentChart = ({ data }) => {
  console.log("Chart Data Received:", data); // Debugging

  if (!data || !data.labels || data.labels.length === 0) {
    return <p>No investment growth data available.</p>;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Investment Growth",
        data: data.growth,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default InvestmentChart;
