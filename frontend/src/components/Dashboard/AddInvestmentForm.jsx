import React, { useState } from "react";
import axios from "axios";

const AddInvestmentForm = ({ onInvestmentAdded }) => {
  const [portfolioName, setPortfolioName] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //Predefined list of portfolios
  const predefinedPortfolios = [
    "Green Energy Fund",
    "Tech & Innovation Fund",
    "Healthcare & Biotech Fund",
    "Real Estate Growth Fund",
    "Cryptocurrency & Blockchain Fund",
    "Renewable Resources Fund",
    "Sustainable Ventures",
    "AI & Automation Fund",
    "Global Market Index",
  ];
  //function sends a POST request to the backend to add a new investment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Get stored JWT token

      const response = await axios.post(
        "http://127.0.0.1:8000/portfolio/",
        {
          portfolio_name: portfolioName,
          allocated_amount: parseFloat(allocatedAmount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPortfolioName(""); // Reset form
      setAllocatedAmount("");

      // Wait briefly before refreshing (ensures database updates fully)
      setTimeout(() => {
        onInvestmentAdded(); // Refresh the dashboard
      }, 500); // Half a second delay
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error); // Show exact backend error
      } else {
        setError("Failed to add investment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4>Add Investment</h4>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/*Portfolio Name Dropdown */}
        <div className="mb-3">
          <label className="form-label">Select Portfolio</label>
          <select
            className="form-select"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            required
          >
            <option value="">-- Select Portfolio --</option>
            {predefinedPortfolios.map((portfolio, index) => (
              <option key={index} value={portfolio}>
                {portfolio}
              </option>
            ))}
          </select>
        </div>

        {/*Allocated Amount Input */}
        <div className="mb-3">
          <label className="form-label">Allocated Amount ($)</label>
          <input
            type="number"
            className="form-control"
            value={allocatedAmount}
            onChange={(e) => setAllocatedAmount(e.target.value)}
            min="1"
            step="0.01"
            required
          />
        </div>

        {/*Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding..." : "Add Investment"}
        </button>
      </form>
    </>
  );
};

export default AddInvestmentForm;
