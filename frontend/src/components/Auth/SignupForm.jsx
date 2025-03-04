import React, { useState } from "react";
import axios from "axios";

const SignupForm = ({ onSignup }) => {
  // State for user input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  // Handle form submission to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Send signup request to backend
      const response = await axios.post(
        "http://127.0.0.1:8000/users/register/",
        {
          email,
          password,
        }
      );

      // Set success message and switch to login form
      alert("Signup successful! Please log in.");
      setError(null); // Clear any previous errors
      setEmail(""); // Clear form fields
      setPassword("");
      setConfirmPassword("");
      onSignup(); // This will switch the form to login
    } catch (err) {
      setError("Signup failed. Email might already be taken.");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Form submitted!");
        handleSubmit(e);
      }}
    >
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

      <div className="mb-3">
        <label>Confirm Password:</label>
        <input
          type="password"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
