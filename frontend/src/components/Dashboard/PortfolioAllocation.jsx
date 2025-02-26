import React, { useState } from "react";

const PortfolioAllocation = ({ portfolio }) => {
  const [showDetails, setShowDetails] = useState(false);

  console.log("Portfolio Data:", portfolio);
  console.log("Portfolio Keys:", Object.keys(portfolio));
  console.log("Portfolio Values:", Object.values(portfolio));

  // Extract only investment objects (ignore `growth` key)
  const investments = Object.values(portfolio).filter(
    (item) => typeof item === "object" && "portfolio_name" in item
  );

  return (
    <div className="card p-3 mb-3">
      <h4>Portfolio Allocation</h4>
      {investments.length > 0 ? (
        <>
          {investments.map((investment) => (
            <p key={investment.id}>
              <strong>{investment.portfolio_name}:</strong> $
              {Number(investment.allocated_amount).toFixed(2)}
            </p>
          ))}

          <button
            className="btn btn-primary"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "View Portfolio"}
          </button>

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
