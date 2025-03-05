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
  const [investmentData, setInvestmentData] = useState({
    labels: [],
    datasets: [],
  });

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
      const growthData = growthResponse.data;
      setPortfolio((prev) => ({ ...prev, growth: growthData }));

      // Construct investment data for chart
      // Mock invested amounts (for testing until real data is available)
      let investedAmounts = [];
      growthData.growth.forEach((_, index) => {
        if (index === 0) {
          investedAmounts.push(100); // Start with an initial investment
        } else {
          investedAmounts.push(investedAmounts[index - 1] + 50); // Simulate adding $50 over time
        }
      });

      const chartData = {
        labels: growthData.labels,
        invested: investedAmounts, // Use the mock cumulative invested amounts
        growth: growthData.growth,
        datasets: [
          {
            label: "Total Invested",
            data: investedAmounts,
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            borderColor: "rgba(34, 197, 94, 1)",
            pointBackgroundColor: "rgba(34, 197, 94, 1)",
            pointBorderColor: "#fff",
            borderWidth: 3,
            tension: 0.3,
          },
          {
            label: "Investment Value",
            data: growthData.growth,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(59, 130, 246, 1)",
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            pointBorderColor: "#fff",
            borderWidth: 3,
            tension: 0.3,
          },
        ],
      };

      setInvestmentData(chartData);
      setLoading(false);
    } catch (err) {
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

  if (loading)
    return (
      <div className="text-center mt-5 text-primary">Loading dashboard...</div>
    );
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  //No inline styles, just Bootstrap classes
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">📊 Investment Dashboard</h2>
      <div className="row">
        {/* Left Column: Savings & Transactions */}
        <div className="col-md-4">
          <div className="card shadow-lg p-3 mb-4 rounded">
            <SavingsSummary savings={savings} />
          </div>
          <div className="card shadow-lg p-3 mb-4 rounded">
            <RecentTransactions transactions={transactions} />
          </div>
        </div>

        {/* Right Column: Portfolio & Chart */}
        <div className="col-md-8">
          <div className="card shadow-lg p-3 mb-4 rounded">
            <PortfolioAllocation portfolio={portfolio} savings={savings} />
          </div>
          <div className="card shadow-lg p-3 mb-4 rounded">
            <InvestmentChart data={investmentData} />
          </div>
        </div>
      </div>

      {/* Add Investment Section */}
      <div className="text-center mt-4">
        <div className="card shadow-lg p-3">
          <h4 className="text-success">💰 Grow Your Investments</h4>
          <AddInvestmentForm onInvestmentAdded={handleInvestmentAdded} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
