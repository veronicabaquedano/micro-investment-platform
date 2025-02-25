import React, { useState } from "react";

const PortfolioAllocation = ({ portfolio }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="card p-3 mb-3">
      <h4>Portfolio Allocation</h4>
      {/* Check if portfolio exists and is not empty */}
      {Array.isArray(portfolio) && portfolio.length > 0 ? (
        <>
          {/* Loop through investments */}
          {portfolio.map((investment) => {
            // Ensure allocated_amount is a number (fallback to 0 if missing)
            const amount = Number(investment.allocated_amount) || 0;

            return (
              <p key={investment.id}>
                <strong>{investment.portfolio_name}:</strong> $
                {amount.toFixed(2)}
              </p>
            );
          })}

          {/* Toggle Button */}
          <button
            className="btn btn-primary"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "View Portfolio"}
          </button>

          {/* Show Details When Button is Clicked */}
          {showDetails && (
            <div className="mt-3">
              <p>More detailed breakdown will be displayed here...</p>
            </div>
          )}
        </>
      ) : (
        <p>No portfolio data available.</p>
      )}
    </div>
  );
};

export default PortfolioAllocation;
