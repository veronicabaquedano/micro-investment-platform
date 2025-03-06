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

      // Generate invested amounts (mocking for now)
      let investedAmounts = growthData.growth.map(
        (_, index) => (index + 1) * 50
      );

      // Store everything in `investmentData`
      setInvestmentData({
        labels: growthData.labels,
        invested: investedAmounts,
        growth: growthData.growth,
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to load dashboard data.");
      setLoading(false);
    }
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
          <div className="card">
            <SavingsSummary savings={savings} />
          </div>
          <div className="card">
            <RecentTransactions transactions={transactions} />
          </div>
        </div>

        {/* Right Column: Portfolio & Chart */}
        <div className="col-md-8">
          <div className="card">
            <PortfolioAllocation portfolio={portfolio} savings={savings} />
          </div>
          <div className="card">
            <InvestmentChart data={investmentData} />
          </div>
        </div>
      </div>

      {/* Add Investment Section */}
      <div className="text-center mt-4">
        <div className="card">
          <h4 className="text-success">💰 Grow Your Investments</h4>
          <AddInvestmentForm onInvestmentAdded={fetchDashboardData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
