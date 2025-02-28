import React, { useState } from "react";

const PortfolioAllocation = ({ portfolio, savings = 0 }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Extract only investment objects (ignore `growth` key)
  const investments = Object.values(portfolio).filter(
    (item) => typeof item === "object" && "portfolio_name" in item
  );

  // Calculate total invested amount
  const totalInvested = investments.reduce(
    (sum, inv) => sum + parseFloat(inv.allocated_amount),
    0
  );

  // Calculate total balance (savings + all investments)
  const totalBalance = parseFloat(savings) + totalInvested;

  // Calculate current portfolio value
  const currentValue =
    portfolio.growth?.[portfolio.growth.length - 1]?.value || totalInvested;

  // Calculate total gains and percentage increase
  const totalGains = currentValue - totalInvested;
  const percentageIncrease =
    totalInvested > 0
      ? ((totalGains / totalInvested) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="card p-3 mb-3">
      <h4>Portfolio Allocation</h4>

      {/* Always show investments (name & amount) */}
      {investments.length > 0 ? (
        <>
          {investments.map((investment) => (
            <p key={investment.id}>
              <strong>{investment.portfolio_name}:</strong> $
              {Number(investment.allocated_amount).toFixed(2)}
            </p>
          ))}

          {/* Toggle Button */}
          <button
            className="btn btn-primary"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails
              ? "Hide Details"
              : `View Portfolio (${percentageIncrease}% growth)`}
          </button>

          {/* Show Detailed Breakdown Only When Button is Clicked */}
          {showDetails && (
            <div className="mt-3">
              <h5>Detailed Breakdown</h5>
              <ul>
                {investments.map((investment) => {
                  const amount = parseFloat(investment.allocated_amount) || 0;
                  const percentage = ((amount / totalBalance) * 100).toFixed(2);
                  return (
                    <li key={investment.id}>
                      {investment.portfolio_name}: ${amount.toFixed(2)} (
                      {percentage}%)
                    </li>
                  );
                })}
                <li>
                  <strong>Savings:</strong> ${parseFloat(savings).toFixed(2)} (
                  {((savings / totalBalance) * 100).toFixed(2)}%)
                </li>
                <li>
                  <strong>Total Gains:</strong> ${totalGains.toFixed(2)} (
                  {percentageIncrease}%)
                </li>
              </ul>
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
