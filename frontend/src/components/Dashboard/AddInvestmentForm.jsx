import React, { useState } from "react";
import axios from "axios";

const AddInvestmentForm = ({ onInvestmentAdded }) => {
  const [portfolioName, setPortfolioName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  //function sends POST request to /portfolio/ endpoint to add new investment.
  const handleInvestment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get stored token

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/portfolio/",
        {
          portfolio_name: portfolioName,
          allocated_amount: parseFloat(amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Investment added:", response.data);
      onInvestmentAdded(); // Refresh portfolio after adding
      setPortfolioName(""); // Reset form
      setAmount("");
    } catch (err) {
      console.error("Error adding investment:", err);
      setError("Failed to add investment. Please try again.");
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h4>Add New Investment</h4>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleInvestment}>
        <div className="mb-2">
          <label>Portfolio Name:</label>
          <input
            type="text"
            className="form-control"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label>Amount:</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Invest
        </button>
      </form>
    </div>
  );
};

export default AddInvestmentForm;
