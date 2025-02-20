import React from "react";

const SavingsSummary = ({ savings }) => {
  return (
    <div className="card p-3 mb-3">
      <h4>Total Savings</h4>
      <p>${savings ? savings.toFixed(2) : "0.00"}</p>
    </div>
  );
};

export default SavingsSummary;
