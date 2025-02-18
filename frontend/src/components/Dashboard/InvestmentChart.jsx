import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
//Registers chart components so they can be used.
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const InvestmentChart = ({ data }) => {
  return (
    <div className="card p-3 mb-3">
      <h4>Investment Growth</h4>
      <Line data={data} />
    </div>
  );
};

export default InvestmentChart;
