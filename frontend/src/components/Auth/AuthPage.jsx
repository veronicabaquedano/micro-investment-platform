import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthPage = ({ onLogin }) => {
  // State to track whether we're showing login (true) or signup (false)
  const [isLogin, setIsLogin] = useState(true);

  // Function to switch between login and signup
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="container mt-5">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      {/* Render LoginForm or SignupForm based on state */}
      {isLogin ? (
        <LoginForm onLogin={onLogin} />
      ) : (
        <SignupForm onSignup={onLogin} />
      )}

      {/* Button to toggle between forms */}
      <button className="btn btn-secondary mt-3" onClick={toggleForm}>
        {isLogin ? "Go to Sign Up" : "Go to Login"}
      </button>
    </div>
  );
};

export default AuthPage;
