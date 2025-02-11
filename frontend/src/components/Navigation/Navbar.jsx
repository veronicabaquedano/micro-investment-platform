import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav style={styles.navbar}>
      {/* App Title */}
      <h2>Micro Investment Platform</h2>

      {/* Navigation Links */}
      <div>
        {user ? (
          // If the user is logged in, show these links
          <>
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <Link to="/bank-link" style={styles.link}>
              Bank Linking
            </Link>
            <button onClick={onLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          // If no user is logged in, show login/signup link
          <Link to="/auth" style={styles.link}>
            Login / Signup
          </Link>
        )}
      </div>
    </nav>
  );
}

/* Inline styles for the navbar */
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    background: "#333",
    color: "#fff",
  },
  link: {
    color: "#fff",
    marginRight: "10px",
    textDecoration: "none",
  },
  button: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default Navbar;
