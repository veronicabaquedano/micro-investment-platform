import React, { useState } from "react";
// BankLinkForm component allows users to link their bank account
const BankLinkForm = ({ onLinkAccount }) => {
  // State variables to store form input values
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [error, setError] = useState(null); // State variable to store error messages
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Validate form inputs
    if (!bankName || !accountNumber || !routingNumber) {
      setError("All fields are required");
      return;
    }
    setError(null); // Clear any previous error messages
    // Call the onLinkAccount callback with the form input values
    onLinkAccount({ bankName, accountNumber, routingNumber });
  };

  return (
    <div className="card p-4 shadow-lg">
      <h4 className="text-primary">🔗 Link Your Bank Account</h4>
      {/* Display error message if any */}
      {error && <p className="text-danger">{error}</p>}{" "}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Bank Name:</label>
          <input
            type="text"
            className="form-control"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)} // Update bankName state on input change
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Account Number:</label>
          <input
            type="text"
            className="form-control"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)} // Update accountNumber state on input change
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Routing Number:</label>
          <input
            type="text"
            className="form-control"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)} // Update routingNumber state on input change
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Link Account
        </button>
      </form>
    </div>
  );
};

export default BankLinkForm;
