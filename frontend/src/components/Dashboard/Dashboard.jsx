import React, { useState, useEffect } from "react";
import axios from "axios";
import SavingsSummary from "./SavingsSummary";
import RecentTransactions from "./RecentTransactions";
import PortfolioAllocation from "./PortfolioAllocation";
import InvestmentChart from "./InvestmentChart";
import AddInvestmentForm from "./AddInvestmentForm";

const Dashboard = () => {
  const [savings, setSavings] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);

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
      setPortfolio(
        Array.isArray(portfolioResponse.data) ? portfolioResponse.data : []
      );

      //Fetch Investment Growth
      const growthResponse = await axios.get(
        "http://127.0.0.1:8000/portfolio/growth/",
        config
      );
      //prev is used to access the previous state of the portfolio
      console.log("Growth Data Response:", growthResponse.data); // Debugging line
      const growthData = growthResponse.data;
      setPortfolio((prev) => ({ ...prev, growth: growthData }));

      // Construct investment data for chart
      const chartData = {
        labels: growthData.labels, // Directly use the labels array
        invested: [], // Placeholder (since the response doesn't include invested data)
        growth: growthData.growth, // Directly use the growth array
      };
      setInvestmentData(chartData);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err); //debug
      setError("Failed to load dashboard data.");
      setLoading(false);
    }
  };

  //Function to refresh dashboard after a new investment is added
  const handleInvestmentAdded = () => {
    fetchDashboardData();
  };
  // fetch dashboard data when Dashboard.jsx component is first rendered.
  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      <AddInvestmentForm onInvestmentAdded={handleInvestmentAdded} />
      <SavingsSummary savings={savings} />
      <RecentTransactions transactions={transactions} />
      <PortfolioAllocation portfolio={portfolio} savings={savings} />
      <InvestmentChart data={investmentData} />
    </div>
  );
};

export default Dashboard;
