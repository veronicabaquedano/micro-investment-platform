import React, { useState } from "react";
import axios from "axios";

// BankLinkForm component allows users to link their bank account
const BankLinkForm = ({ onLinkAccount }) => {
  // State variables to store form input values
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [error, setError] = useState(null); // Store error messages
  const [loading, setLoading] = useState(false); // Track form submission status

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate form inputs
    if (!bankName || !accountNumber || !routingNumber) {
      setError("All fields are required");
      return;
    }

    setError(null); // Clear any previous error messages
    setLoading(true); // Set loading state

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/bank/",
        {
          bank_name: bankName,
          account_number: accountNumber,
          routing_number: routingNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onLinkAccount(response.data); // Update parent component with new account
      setBankName("");
      setAccountNumber("");
      setRoutingNumber("");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to link bank account.");
    }

    setLoading(false); // Reset loading state
  };

  return (
    <div className="card p-4 shadow-lg">
      <h4 className="text-primary">🔗 Link Your Bank Account</h4>
      {/* Display error message if any */}
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Bank Name:</label>
          <input
            type="text"
            className="form-control"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Account Number:</label>
          <input
            type="text"
            className="form-control"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Routing Number:</label>
          <input
            type="text"
            className="form-control"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading ? "Linking..." : "Link Account"}
        </button>
      </form>
    </div>
  );
};

export default BankLinkForm;
