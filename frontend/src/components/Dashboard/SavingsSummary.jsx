import React from "react";
import { Typography, Box } from "@mui/material";

const SavingsSummary = ({ savings }) => {
  // Ensure savings is a number (fallback to 0 if null/undefined)
  const formattedSavings = Number(savings) || 0;
  return (
    <Box textAlign="center">
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Total Savings
      </Typography>
      <Typography variant="h4" color="primary" fontWeight={700}>
        ${formattedSavings.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default SavingsSummary;
