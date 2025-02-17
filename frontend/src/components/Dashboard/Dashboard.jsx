import React from "react";
import SavingsSummary from "./SavingsSummary";
import RecentTransactions from "./RecentTransactions";
import PortfolioAllocation from "./PortfolioAllocation";
import InvestmentChart from "./InvestmentChart";

const Dashboard = () => {
  // Placeholder static data (replace this with API data later)
  const savings = 500; // Example total savings
  const transactions = [
    { id: 1, description: "Coffee round-up", amount: 0.75 },
    { id: 2, description: "Grocery round-up", amount: 1.25 },
    { id: 3, description: "Gas round-up", amount: 0.5 },
  ];
  const portfolio = {
    stocks: 60, // 60% stocks
    bonds: 30, // 30% bonds
    cash: 10, // 10% cash
  };
  // chart using chart.js
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Investment Growth",
        data: [100, 150, 200, 250, 300],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
      },
    ],
  };
  //passes savings, transactions, protfolio, chartData as props to SavingsSummary etc...
  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <SavingsSummary savings={savings} />
      <RecentTransactions transactions={transactions} />
      <PortfolioAllocation portfolio={portfolio} />
      <InvestmentChart data={chartData} />
    </div>
  );
};

export default Dashboard;
