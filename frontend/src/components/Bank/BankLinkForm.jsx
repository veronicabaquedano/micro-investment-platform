import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";

// BankLinkForm component allows users to link their bank account
const BankLinkForm = ({ onLinkAccount }) => {
  // State variables to store form input values
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [error, setError] = useState(null); // Store error messages
  const [loading, setLoading] = useState(false); // Track form submission status

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate form inputs
    if (!bankName || !accountNumber || !routingNumber) {
      setError("All fields are required");
      return;
    }

    // Ensure account number is numeric and has 6-17 digits
    const accountNumberRegex = /^\d{6,17}$/;
    if (!accountNumberRegex.test(accountNumber)) {
      setError(
        "Account number must be between 6 and 17 digits and contain only numbers."
      );
      return;
    }

    // Ensure routing number is exactly 9 digits
    const routingNumberRegex = /^\d{9}$/;
    if (!routingNumberRegex.test(routingNumber)) {
      setError("Routing number must be exactly 9 digits.");
      return;
    }

    setError(null); // Clear any previous error messages
    setLoading(true); // Set loading state

    try {
      const token = localStorage.getItem("token");
      const requestData = {
        bank_name: bankName,
        account_number: accountNumber,
        routing_number: routingNumber,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/bank/",
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onLinkAccount(response.data); // Update parent component with new account
      setBankName("");
      setAccountNumber("");
      setRoutingNumber("");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to link bank account.");
    }

    setLoading(false); // Reset loading state
  };

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: { xs: 2, md: 4 },
      }}
    >
      <Typography
        variant="h5"
        color="primary"
        align="center"
        gutterBottom
        sx={{ fontSize: { xs: "1.4rem", md: "2rem" } }}
      >
        Link Your Bank Account
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: { xs: 2, md: 3 } }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Routing Number"
          value={routingNumber}
          onChange={(e) => setRoutingNumber(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 1, md: 2 } }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Link Account"
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default BankLinkForm;
