import React, { useState } from "react";

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
    <form onSubmit={handleSubmit}>
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-3">
        <label>Email:</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password:</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
