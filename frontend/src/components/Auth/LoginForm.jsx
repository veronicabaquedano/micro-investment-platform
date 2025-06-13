import React, { useState } from "react";
import { Card, TextField, Button, Typography, Alert, Box } from "@mui/material";

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
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 6, p: 3, boxShadow: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Card>
  );
};

export default LoginForm;
