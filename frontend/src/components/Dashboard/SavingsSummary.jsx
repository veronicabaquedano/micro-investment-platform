import React from "react";

const SavingsSummary = ({ savings }) => {
  // Ensure savings is a number (fallback to 0 if null/undefined)
  const formattedSavings = Number(savings) || 0;
  return (
    <>
      <h4>Total Savings</h4>
      <p>${formattedSavings.toFixed(2)}</p>
    </>
  );
};

export default SavingsSummary;
