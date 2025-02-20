import React from "react";

const RecentTransactions = ({ transactions }) => {
  return (
    <div className="card p-3 mb-3">
      <h4>Recent Transactions</h4>
      <ul className="list-group">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <li key={transaction.id} className="list-group-item">
              <strong>{transaction.description}</strong>: $
              {transaction.amount.toFixed(2)}
            </li>
          ))
        ) : (
          <p>No recent transactions.</p>
        )}
      </ul>
    </div>
  );
};

export default RecentTransactions;
