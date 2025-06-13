import React, { useState } from "react";
import { TextField, Button, Typography, Alert, Box, Link } from "@mui/material";

const LoginForm = ({ onLogin }) => {
  // State for email, password, (to store user input) and error messages (handle login failures)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Handle form submission to backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError(null); // Clear previous error before a new login attempt
    onLogin(email, password, setError); // This calls `handleLogin` in App.jsx
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" align="center" gutterBottom>
        Login to your account
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2, mb: 1 }}
      >
        Login
      </Button>
      <Box textAlign="right">
        <Link href="#" variant="body2" underline="hover">
          Forgot password?
        </Link>
      </Box>
    </Box>
  );
};

export default LoginForm;
