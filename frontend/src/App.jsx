import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./components/Auth/AuthPage";
import Dashboard from "./components/Dashboard/Dashboard";
import BankLinkingPage from "./components/Bank/BankLinkingPage";
import Navbar from "./components/Navigation/Navbar";

function App() {
  // Temporary authentication state (this will later be replaced with backend logic)
  // Temporarly holds user data
  const [user, setUser] = useState(null);

  // Updates user when they log in. (replace this with API authentication later)
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Clears user data to log them out.
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
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
    </Router>
  );
}

export default App;
