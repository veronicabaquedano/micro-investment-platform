import React, { useState } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthPage from "./components/Auth/AuthPage";
import Dashboard from "./components/Dashboard/Dashboard";
import BankLinkingPage from "./components/Bank/BankLinkingPage";
import Navbar from "./components/Navigation/Navbar";

function App() {
  // Temporary authentication state (this will later be replaced with backend logic)
  // Temporarly holds user data
  const [user, setUser] = useState(null);
  // used to programmmatically navigate to different pages.
  const navigate = useNavigate();

  // Updates user when they log in. (replace this with API authentication later)
  const handleLogin = async (email, password, setError) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/users/login/", {
        email: email, // Ensure email is a string
        password: password, // Ensure password is a string
      });

      // Check if login was successful and update user state
      if (response.status === 200) {
        // Handle login success, for example, store user data
        setUser(response.data);
        navigate("/dashboard"); // Redirects after login
      }
    } catch (error) {
      // Handle login failure
      console.error("Login failed", error.response);
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // Pass the error message to the form
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  // Clears user data to log them out.
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <Navbar // Navbar update dynamically depending on whether the user is logged in.
        user={user}
        onLogout={handleLogout}
      />
      <Routes>
        <Route
          // Redirects to /dashboard if logged in, otherwise /auth.
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/auth"} />}
        />
        <Route // Shows the authentication page (Login/Signup).
          path="/auth"
          element={<AuthPage onLogin={handleLogin} />}
        />
        <Route //Only accessible if logged in, otherwise redirects to /auth.
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/auth" />}
        />
        <Route // Only accessible if logged in, otherwise redirects to /auth.
          path="/bank-link"
          element={user ? <BankLinkingPage /> : <Navigate to="/auth" />}
        />
      </Routes>
    </>
  );
}

export default App;
