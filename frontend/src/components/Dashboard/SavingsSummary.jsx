import React from "react";
import { Typography, Box } from "@mui/material";

const SavingsSummary = ({ savings }) => {
  // Ensure savings is a number (fallback to 0 if null/undefined)
  const formattedSavings = Number(savings) || 0;
  return (
    <Box textAlign="center">
      <Typography
        variant="h6"
        color="text.secondary"
        gutterBottom
        sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
      >
        Total Savings
      </Typography>
      <Typography
        variant="h4"
        color="primary"
        fontWeight={700}
        sx={{ fontSize: { xs: "2rem", md: "2.7rem" } }}
      >
        ${formattedSavings.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default SavingsSummary;
