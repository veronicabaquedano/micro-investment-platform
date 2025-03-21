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
      // Adjust API response to match frontend expectations
      const formattedAccounts = response.data.map((account) => ({
        id: account.id,
        bank_name: account.bank_name,
        account_number: account.decrypted_account_number, // Fix name
        routing_number: account.decrypted_routing_number, // Fix name
        created_at: account.created_at,
      }));
      setLinkedAccounts(formattedAccounts);
    } catch (error) {
      setErrorMessage("Failed to load linked accounts.");
    }
  };

  // Function to handle linking a new bank account
  const onLinkAccount = async (newAccount) => {
    console.log("Received new account from form:", newAccount); // Debug
    setLinkedAccounts((prevAccounts) => [...prevAccounts, newAccount]);
    await fetchLinkedAccounts(); // Ensures the UI updates properly
    setSuccessMessage("Bank account linked successfully!");
    setErrorMessage("");
  };

  // Function to remove a linked bank account
  const removeAccount = async (accountId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bank account?"
    );
    if (!confirmDelete) return; // Stop if user cancels

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/bank/${accountId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //Remove from UI after successful deletion
      setLinkedAccounts(
        linkedAccounts.filter((account) => account.id !== accountId)
      );
      setSuccessMessage("Bank account deleted successfully!");
      setErrorMessage("");
    } catch (error) {
      console.log("Error deleting account:", error.response?.data); // Debugging log
      // Check if the error message matches our "last account" rule
      if (
        error.response?.data?.error ===
        "You must have at least one linked bank account."
      ) {
        setErrorMessage("Cannot delete your last linked bank account!");
      } else {
        setErrorMessage("Failed to remove bank account.");
      }
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
            <h4 className="text-success">Linked Bank Accounts</h4>
            <ul className="list-group">
              {linkedAccounts.map((account, index) => (
                <li
                  key={account.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    <strong>{account.bank_name}</strong> - ****
                    {account.account_number
                      ? account.account_number.slice(-4)
                      : "XXXX"}
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
