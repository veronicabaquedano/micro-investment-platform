import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const InvestmentChart = ({ data }) => {
  // Ensure data is available before rendering the chart
  if (!data || !data.growth) {
    return <p>Loading chart...</p>;
  }

  const chartData = {
    labels: data.labels || ["Jan", "Feb", "Mar", "Apr", "May"], // Default months if no data
    datasets: [
      {
        label: "Investment Growth",
        data: data.growth || [100, 150, 200, 250, 300], // Default data if empty
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default InvestmentChart;
