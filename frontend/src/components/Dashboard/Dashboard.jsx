import React, { useState, useEffect } from "react";
import axios from "axios";
import SavingsSummary from "./SavingsSummary";
import RecentTransactions from "./RecentTransactions";
import PortfolioAllocation from "./PortfolioAllocation";
import InvestmentChart from "./InvestmentChart";

const Dashboard = () => {
  const [savings, setSavings] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token"); //Get token from storage
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, //Send token with requests
          },
        };

        // Fetch savings
        const savingsResponse = await axios.get(
          "http://127.0.0.1:8000/savings/",
          config
        );
        setSavings(savingsResponse.data.total_savings);

        // Fetch transactions
        const transactionsResponse = await axios.get(
          "http://127.0.0.1:8000/transactions/",
          config
        );
        setTransactions(transactionsResponse.data.slice(0, 10)); // Get last 10 transactions

        // Fetch portfolio allocation
        const portfolioResponse = await axios.get(
          "http://127.0.0.1:8000/portfolio/",
          config
        );
        setPortfolio(portfolioResponse.data);

        //Fetch Investment Growth
        const growthResponse = await axios.get(
          "http://127.0.0.1:8000/portfolio/growth/",
          config
        );
        //prev is used to access the previous state of the portfolio
        setPortfolio((prev) => ({ ...prev, growth: growthResponse.data }));

        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <SavingsSummary savings={savings} />
      <RecentTransactions transactions={transactions} />
      <PortfolioAllocation portfolio={portfolio} />
      <InvestmentChart data={portfolio.growth} />
    </div>
  );
};

export default Dashboard;
