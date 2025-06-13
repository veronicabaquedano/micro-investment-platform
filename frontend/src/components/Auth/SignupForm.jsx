import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Alert, Box } from "@mui/material";

const SignupForm = ({ onSignup }) => {
  // State for user input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  // Handle form submission to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Basic email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simple validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send signup request to backend
      await axios.post("http://127.0.0.1:8000/users/register/", {
        email,
        password,
      });

      // Set success message and switch to login form
      alert("Signup successful! Please log in.");
      setEmail(""); // Clear form fields
      setPassword("");
      setConfirmPassword("");
      onSignup(); // This will switch the form to login
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;

        // Prioritize showing password errors first
        if (errorData.password) {
          setError(errorData.password[0]); // Show password error
        } else if (errorData.email) {
          setError(errorData.email[0]); // Show email error
        } else {
          setError("Signup failed. Please try again.");
        }
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" align="center" gutterBottom>
        Create your account
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        Sign up to start investing your spare change!
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default SignupForm;
