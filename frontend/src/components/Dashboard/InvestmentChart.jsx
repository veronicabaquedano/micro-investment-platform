import React from "react";
import { Line } from "react-chartjs-2";
import { Typography, Box, useTheme } from "@mui/material";
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
  const theme = useTheme();

  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <Box textAlign="center" my={2}>
        <Typography color="error" sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}>
          No investment growth data available.
        </Typography>
      </Box>
    );
  }

  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: "Total Invested",
        data: data.invested || [],
        backgroundColor: theme.palette.primary.light + "33",
        borderColor: theme.palette.primary.main,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: "#fff",
        borderWidth: 3,
        tension: 0.3,
      },
      {
        label: "Investment Value",
        data: data.growth || [],
        backgroundColor: theme.palette.secondary.light + "33",
        borderColor: theme.palette.secondary.main,
        pointBackgroundColor: theme.palette.secondary.main,
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
        display: true,
        position: "top",
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: 14,
            family: theme.typography.fontFamily,
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => `$${tooltipItem.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.primary },
        grid: { color: theme.palette.divider },
      },
      y: {
        ticks: { color: theme.palette.text.primary },
        grid: { color: theme.palette.divider },
      },
    },
  };

  return (
    <Box sx={{ height: { xs: 220, md: 300 } }}>
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default InvestmentChart;
