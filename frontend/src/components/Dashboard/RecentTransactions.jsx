import React from "react";

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="card p-3 mb-3">
      <h4>Recent Transactions</h4>
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            {tx.description}: ${tx.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
