import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ onLogin }) => {
  // State for email, password, (to store user input) and error messages (handle login failures)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Handle form submission to backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      // Send login request to backend
      const response = await axios.post("http://127.0.0.1:8000/users/login/", {
        email,
        password,
      });

      // Call onLogin function passed from parent (AuthPage)
      onLogin(response.data);
    } catch (err) {
      // Handle errors (e.g., wrong credentials)
      setError("Invalid email or password. Please try again.");
    }
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
