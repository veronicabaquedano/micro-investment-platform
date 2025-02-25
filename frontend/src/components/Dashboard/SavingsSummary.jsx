import React from "react";

const SavingsSummary = ({ savings }) => {
  // Ensure savings is a number (fallback to 0 if null/undefined)
  const formattedSavings = Number(savings) || 0;
  return (
    <div className="card p-3 mb-3">
      <h4>Total Savings</h4>
      <p>${formattedSavings.toFixed(2)}</p>
    </div>
  );
};

export default SavingsSummary;
