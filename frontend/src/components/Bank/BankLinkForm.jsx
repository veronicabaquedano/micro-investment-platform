import React, { useState } from "react";
// BankLinkForm component allows users to link their bank account
//onLinkAccount is a callback function that will be called when form is submitted
const BankLinkForm = ({ onLinkAccount }) => {
  // State variables to store form input values
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  // State variable to store error messages
  const [error, setError] = useState(null);
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
            /*update bankName state on input change*/
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
            /*update accountNumber state on input change*/
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
            /*update routingNumber state on input change*/
            onChange={(e) => setRoutingNumber(e.target.value)}
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
