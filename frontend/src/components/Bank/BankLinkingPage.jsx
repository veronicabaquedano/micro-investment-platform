import React, { useState } from "react";
import BankLinkForm from "./BankLinkForm";

const BankLinkingPage = () => {
  // State to store linked bank account details
  const [linkedAccount, setLinkedAccount] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handles linking a bank account.
   * This function will eventually send data to the backend or Plaid API.
   * For now, it simply updates the state with entered bank details.
   */
  const onLinkAccount = (accountDetails) => {
    try {
      // Assuming we get a success response
      setLinkedAccount(accountDetails);
      setSuccessMessage("Bank account linked successfully!");
      setErrorMessage(""); // clear any previous errors
    } catch (error) {
      setErrorMessage("Failed to link bank account.");
      setSuccessMessage(""); // clear any previous success messages
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary">🏦 Link Your Bank Account</h2>
      <div className="card shadow-lg p-4">
        {/* Display Success or Error Message */}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {/* Show the bank linking form if no account is linked yet */}
        {!linkedAccount ? (
          <BankLinkForm onLinkAccount={onLinkAccount} />
        ) : (
          <div className="text-center">
            <h4 className="text-success">✅ Bank Account Linked!</h4>
            <p>
              <strong>Bank Name:</strong> {linkedAccount.bankName}
            </p>
            <p>
              <strong>Account Number:</strong> ****
              {linkedAccount.accountNumber.slice(-4)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankLinkingPage;
