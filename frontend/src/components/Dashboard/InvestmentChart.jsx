import React, { useState, useEffect } from "react";
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

const InvestmentChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvestmentGrowth = async () => {
      try {
        // Get the stored JWT token
        const token = localStorage.getItem("access_token");

        // Ensure a token exists before making the request
        if (!token) {
          setError("User is not authenticated.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/portfolio/growth/",
          {
            headers: {
              Authorization: `Bearer ${token}`, //Attach JWT token
            },
            withCredentials: true,
          }
        );

        console.log("Investment growth data:", response.data);

        if (response.data.labels.length === 0) {
          setError("No investment growth data available.");
          setLoading(false);
          return;
        }

        setChartData({
          labels: response.data.labels,
          datasets: [
            {
              label: "Investment Growth",
              data: response.data.growth,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 2,
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching investment growth data:", err);
        setError("Failed to load investment growth data.");
        setLoading(false);
      }
    };

    fetchInvestmentGrowth();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return <Line data={chartData} />;
};

export default InvestmentChart;
