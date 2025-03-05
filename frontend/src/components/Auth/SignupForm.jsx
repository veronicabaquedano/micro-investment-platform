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
      const response = await axios.post(
        "http://127.0.0.1:8000/users/register/",
        {
          email,
          password,
        }
      );

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
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
        {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email !== "" && (
          <p className="text-danger">Please enter a valid email address.</p>
        )}
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
