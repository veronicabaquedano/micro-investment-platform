import React, { useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";

const AddInvestmentForm = ({ onInvestmentAdded }) => {
  const [portfolioName, setPortfolioName] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //Predefined list of portfolios
  const predefinedPortfolios = [
    "Green Energy Fund",
    "Tech & Innovation Fund",
    "Healthcare & Biotech Fund",
    "Real Estate Growth Fund",
    "Cryptocurrency & Blockchain Fund",
    "Renewable Resources Fund",
    "Sustainable Ventures",
    "AI & Automation Fund",
    "Global Market Index",
  ];
  //function sends a POST request to the backend to add a new investment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Get stored JWT token

      await axios.post(
        "http://127.0.0.1:8000/portfolio/",
        {
          portfolio_name: portfolioName,
          allocated_amount: parseFloat(allocatedAmount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPortfolioName(""); // Reset form
      setAllocatedAmount("");

      // Wait briefly before refreshing (ensures database updates fully)
      setTimeout(() => {
        onInvestmentAdded(); // Refresh the dashboard
      }, 500); // Half a second delay
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error); // Show exact backend error
      } else {
        setError("Failed to add investment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography
        variant="h6"
        color="primary"
        gutterBottom
        sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
      >
        Add Investment
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: { xs: 2, md: 3 } }}>
          {error}
        </Alert>
      )}
      <TextField
        select
        label="Select Portfolio"
        value={portfolioName}
        onChange={(e) => setPortfolioName(e.target.value)}
        fullWidth
        margin="normal"
        required
      >
        <MenuItem value="">-- Select Portfolio --</MenuItem>
        {predefinedPortfolios.map((portfolio, index) => (
          <MenuItem key={index} value={portfolio}>
            {portfolio}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Allocated Amount ($)"
        type="number"
        value={allocatedAmount}
        onChange={(e) => setAllocatedAmount(e.target.value)}
        fullWidth
        margin="normal"
        inputProps={{ min: 1, step: 0.01 }}
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: { xs: 2, md: 3 } }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Add Investment"
        )}
      </Button>
    </Box>
  );
};

export default AddInvestmentForm;
