import React, { useState, useEffect } from "react";
import axios from "axios";
import SavingsSummary from "./SavingsSummary";
import RecentTransactions from "./RecentTransactions";
import PortfolioAllocation from "./PortfolioAllocation";
import InvestmentChart from "./InvestmentChart";
import AddInvestmentForm from "./AddInvestmentForm";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Investment Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Left Column: Savings & Transactions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ mb: 3, p: 2 }}>
            <SavingsSummary savings={savings} />
          </Paper>
          <Paper sx={{ p: 2 }}>
            <RecentTransactions transactions={transactions} />
          </Paper>
        </Grid>

        {/* Right Column: Portfolio & Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3, p: 2 }}>
            <PortfolioAllocation portfolio={portfolio} savings={savings} />
          </Paper>
          <Paper sx={{ p: 2 }}>
            <InvestmentChart data={investmentData} />
          </Paper>
        </Grid>
      </Grid>

      {/* Add Investment Section */}
      <Box sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
        <Paper sx={{ p: 3 }}>
          <Typography
            variant="h6"
            color="success.main"
            align="center"
            gutterBottom
          >
            Grow Your Investments
          </Typography>
          <AddInvestmentForm onInvestmentAdded={fetchDashboardData} />
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
