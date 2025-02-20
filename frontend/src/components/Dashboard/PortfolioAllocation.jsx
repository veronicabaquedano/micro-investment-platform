import React, { useState } from "react";

const PortfolioAllocation = ({ portfolio }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="card p-3 mb-3">
      <h4>Portfolio Allocation</h4>
      {portfolio && Object.keys(portfolio).length > 0 ? (
        <>
          {/* Display main investment types dynamically */}
          {Object.entries(portfolio).map(([key, value]) => (
            <p key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
              {value}%
            </p>
          ))}

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
