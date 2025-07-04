import React, { useState, useEffect } from "react";
import BankLinkForm from "./BankLinkForm";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff, Delete } from "@mui/icons-material";

const BankLinkingPage = () => {
  // State to store linked bank account details (in array instead of single object)
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Track which account is being viewed
  const [viewingIndex, setViewingIndex] = useState(null);

  // Fetch linked bank accounts from backend on component mount
  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  // Function to fetch linked bank accounts from the backend
  const fetchLinkedAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/bank/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Adjust API response to match frontend expectations
      const formattedAccounts = response.data.map((account) => ({
        id: account.id,
        bank_name: account.bank_name,
        account_number: account.decrypted_account_number, // Fix name
        routing_number: account.decrypted_routing_number, // Fix name
        created_at: account.created_at,
      }));
      setLinkedAccounts(formattedAccounts);
    } catch (error) {
      setErrorMessage("Failed to load linked accounts.");
    }
  };

  // Function to handle linking a new bank account
  const onLinkAccount = async (newAccount) => {
    setLinkedAccounts((prevAccounts) => [...prevAccounts, newAccount]);
    await fetchLinkedAccounts(); // Ensures the UI updates properly
    setSuccessMessage("Bank account linked successfully!");
    setErrorMessage("");
  };

  // Function to remove a linked bank account
  const removeAccount = async (accountId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bank account?"
    );
    if (!confirmDelete) return; // Stop if user cancels

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/bank/${accountId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //Remove from UI after successful deletion
      setLinkedAccounts(
        linkedAccounts.filter((account) => account.id !== accountId)
      );
      setSuccessMessage("Bank account deleted successfully!");
      setErrorMessage("");
    } catch (error) {
      // Check if the error message matches our "last account" rule
      if (
        error.response?.data?.error ===
        "You must have at least one linked bank account."
      ) {
        setErrorMessage("Cannot delete your last linked bank account!");
      } else {
        setErrorMessage("Failed to remove bank account.");
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: { xs: 2, md: 4 },
        px: { xs: 1, md: 0 },
      }}
    >
      <Typography
        variant="h4"
        color="primary"
        align="center"
        gutterBottom
        sx={{ fontSize: { xs: "1.7rem", md: "2.2rem" } }}
      >
        Link Your Bank Account
      </Typography>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 } }}>
        {successMessage && (
          <Alert severity="success" sx={{ mb: { xs: 2, md: 3 } }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: { xs: 2, md: 3 } }}>
            {errorMessage}
          </Alert>
        )}

        <BankLinkForm onLinkAccount={onLinkAccount} />

        {linkedAccounts.length > 0 && (
          <Box sx={{ mt: { xs: 3, md: 4 } }}>
            <Typography
              variant="h6"
              color="success.main"
              gutterBottom
              sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
            >
              Linked Bank Accounts
            </Typography>
            <List>
              {linkedAccounts.map((account, index) => (
                <React.Fragment key={account.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          color="primary"
                          onClick={() =>
                            setViewingIndex(
                              viewingIndex === index ? null : index
                            )
                          }
                          sx={{ mr: 1 }}
                        >
                          {viewingIndex === index ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => removeAccount(account.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <span>
                          <strong>{account.bank_name}</strong> - ****
                          {account.account_number
                            ? account.account_number.slice(-4)
                            : "XXXX"}
                        </span>
                      }
                    />
                  </ListItem>
                  <Collapse
                    in={viewingIndex === index}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box
                      sx={{
                        bgcolor: "background.default",
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" gutterBottom>
                        Account Details
                      </Typography>
                      <Typography variant="body2">
                        <strong>Bank Name:</strong> {account.bank_name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Account Number:</strong>{" "}
                        {account.account_number}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Routing Number:</strong>{" "}
                        {account.routing_number}
                      </Typography>
                    </Box>
                  </Collapse>
                  {index < linkedAccounts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default BankLinkingPage;
