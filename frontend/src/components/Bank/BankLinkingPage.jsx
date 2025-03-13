import React, { useState, useEffect } from "react";
import BankLinkForm from "./BankLinkForm";
import axios from "axios";

const BankLinkingPage = () => {
  // State to store linked bank account details (in array instead of single object)
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Track which account is being viewed
  const [viewingIndex, setViewingIndex] = useState(null);

  // Fetch linked bank accounts from backend on component mount
  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  // Function to fetch linked bank accounts from the backend
  const fetchLinkedAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/bank/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinkedAccounts(response.data);
    } catch (error) {
      setErrorMessage("Failed to load linked accounts.");
    }
  };

  // Function to handle linking a new bank account
  const onLinkAccount = async (accountDetails) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/bank/",
        accountDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update state with new accounts
      setLinkedAccounts([...linkedAccounts, response.data]);
      setSuccessMessage("Bank account linked successfully!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Failed to link bank account."
      );
    }
  };

  // Function to remove a linked bank account
  const removeAccount = async (accountId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/bank/${accountId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove account from state
      setLinkedAccounts(
        linkedAccounts.filter((account) => account.id !== accountId)
      );
    } catch (error) {
      setErrorMessage("Failed to remove bank account.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary">🏦 Link Your Bank Account</h2>
      <div className="card shadow-lg p-4">
        {/* Display Success or Error Messages */}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        {/* Bank Linking Form */}
        <BankLinkForm onLinkAccount={onLinkAccount} />

        {/* Display Linked Bank Accounts */}
        {linkedAccounts.length > 0 && (
          <div className="mt-4">
            <h4 className="text-success">✅ Linked Bank Accounts</h4>
            <ul className="list-group">
              {linkedAccounts.map((account, index) => (
                <li
                  key={account.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    <strong>{account.bank_name}</strong> - ****
                    {account.account_number.slice(-4)}
                  </span>
                  <div>
                    {/* Toggle View Button */}
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() =>
                        setViewingIndex(viewingIndex === index ? null : index)
                      }
                    >
                      {viewingIndex === index ? "Hide" : "View"}
                    </button>
                    {/* Remove Account Button */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeAccount(account.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {/* Display Account Details when "View" is clicked */}
            {viewingIndex !== null && (
              <div className="mt-3 p-3 border rounded bg-light">
                <h5>🔍 Account Details</h5>
                <p>
                  <strong>Bank Name:</strong>{" "}
                  {linkedAccounts[viewingIndex].bank_name}
                </p>
                <p>
                  <strong>Account Number:</strong>{" "}
                  {linkedAccounts[viewingIndex].account_number}
                </p>
                <p>
                  <strong>Routing Number:</strong>{" "}
                  {linkedAccounts[viewingIndex].routing_number}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BankLinkingPage;
