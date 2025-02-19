import React, { useState } from "react";

const PortfolioAllocation = ({ portfolio }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="card p-3 mb-3">
      <h4>Portfolio Allocation</h4>
      <p>Stocks: {portfolio.stocks}%</p>
      <p>Bonds: {portfolio.bonds}%</p>
      <p>Cash: {portfolio.cash}%</p>
      {/* if showDetails is true see button that says hide else show. */}
      <button
        className="btn btn-primary"
        onClick={() => setShowDetails(!showDetails)}
      >
        /* if showDetails is true see button that says hide else show. */
        {showDetails ? "Hide Details" : "View Portfolio"}
      </button>

      {showDetails && (
        <div className="mt-3">
          <p>More detailed breakdown will be displayed here...</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioAllocation;
