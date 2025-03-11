import React, { useState, useEffect } from "react";
import BankLinkForm from "./BankLinkForm";

const BankLinkingPage = () => {
  // State to store linked bank account details (in array instead of single object)
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Track which account is being viewed
  const [viewingIndex, setViewingIndex] = useState(null);

  //Retrieves accounts from local storage when the page loads
  useEffect(() => {
    const savedAccounts =
      JSON.parse(localStorage.getItem("linkedAccounts")) || [];
    setLinkedAccounts(savedAccounts);
  }, []);

  //Handles linking a new bank account. Saves to state and local storage.
  //accountDetails used to store and pass details of new bank account to be linked.
  const onLinkAccount = (accountDetails) => {
    try {
      //Adds a new account to the array (instead of replacing the existing one)
      const updatedAccounts = [...linkedAccounts, accountDetails];
      setLinkedAccounts(updatedAccounts);
      //Saves linked accounts to localStorage
      localStorage.setItem("linkedAccounts", JSON.stringify(updatedAccounts));
      setSuccessMessage("Bank account linked successfully!");
      setErrorMessage(""); // clear any previous errors
    } catch (error) {
      setErrorMessage("Failed to link bank account.");
      setSuccessMessage(""); // clear any previous success messages
    }
  };

  // Handles removing a linked account. index is position of the account in the array
  const removeAccount = (index) => {
    //Removes the account from both state and local storage
    const updatedAccounts = linkedAccounts.filter((_, i) => i !== index);
    setLinkedAccounts(updatedAccounts);
    localStorage.setItem("linkedAccounts", JSON.stringify(updatedAccounts));
  };

  // Function to toggle account details view
  const toggleViewAccount = (index) => {
    setViewingIndex(viewingIndex === index ? null : index); // Toggle view on/off
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
        {/* Bank Linking Form */}
        <BankLinkForm onLinkAccount={onLinkAccount} />

        {/* Display Linked Accounts */}
        {linkedAccounts.length > 0 && (
          <div className="mt-4">
            <h4 className="text-success">✅ Linked Bank Accounts</h4>
            <ul className="list-group">
              {linkedAccounts.map((account, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    <strong>{account.bankName}</strong> - ****
                    {account.accountNumber.slice(-4)}
                  </span>
                  <div>
                    {/* View Button */}
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => toggleViewAccount(index)}
                    >
                      {viewingIndex === index ? "Hide" : "View"}
                    </button>

                    {/*Each account has a "Remove" button:*/}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeAccount(index)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {/* Display account details when "View" is clicked */}
            {viewingIndex !== null && (
              <div className="mt-3 p-3 border rounded bg-light">
                <h5>🔍 Account Details</h5>
                <p>
                  <strong>Bank Name:</strong>{" "}
                  {linkedAccounts[viewingIndex].bankName}
                </p>
                <p>
                  <strong>Account Number:</strong>{" "}
                  {linkedAccounts[viewingIndex].accountNumber}
                </p>
                <p>
                  <strong>Routing Number:</strong>{" "}
                  {linkedAccounts[viewingIndex].routingNumber}
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
