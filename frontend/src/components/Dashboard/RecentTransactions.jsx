import React from "react";

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="card p-3 mb-3">
      <h4>Recent Transactions</h4>
      <ul className="list-group">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            // Ensure amount is a number (fallback to 0 if missing)
            const amount = Number(transaction.amount) || 0;
            return (
              <li key={transaction.id} className="list-group-item">
                <strong>{transaction.description}</strong>: ${amount.toFixed(2)}
              </li>
            );
          })
        ) : (
          <p>No recent transactions.</p>
        )}
      </ul>
    </div>
  );
};

export default RecentTransactions;
