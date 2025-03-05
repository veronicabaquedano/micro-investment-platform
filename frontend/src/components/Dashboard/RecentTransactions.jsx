import React from "react";

const RecentTransactions = ({ transactions }) => {
  return (
    <>
      <h4>Recent Transactions</h4>
      <ul className="list-group">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            // Ensure amount is a number (fallback to 0 if missing)
            const amount = Number(transaction.amount) || 0;
            return (
              <li key={transaction.id} className="list-group-item">
                <strong>{transaction.description || "No Description"}</strong>:
                ${amount.toFixed(2)}
              </li>
            );
          })
        ) : (
          <p>No recent transactions.</p>
        )}
      </ul>
    </>
  );
};

export default RecentTransactions;
