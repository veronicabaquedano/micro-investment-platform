import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Grid, Box, Typography, Paper, Button } from "@mui/material";

const AuthPage = ({ onLogin }) => {
  // State to track whether we're showing login (true) or signup (false)
  const [isLogin, setIsLogin] = useState(true);

  // Function to switch between login and signup
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left side: Branding/Tagline */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          bgcolor: "#f0f2f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          pr: { xs: 0, md: 8 },
          pl: { xs: 0, md: 4 },
        }}
      >
        <Box sx={{ maxWidth: 400 }}>
          <Typography
            variant="h2"
            color="primary"
            fontWeight={700}
            gutterBottom
          >
            MicroInvest
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Invest your spare change. Grow your future.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Secure, simple, and smart micro-investing for everyone.
          </Typography>
        </Box>
      </Grid>

      {/* Right side: Auth Card */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          bgcolor: "#fff",
          pl: { xs: 0, md: 8 },
          pr: { xs: 0, md: 4 },
        }}
      >
        <Paper elevation={4} sx={{ width: "100%", maxWidth: 400, p: 4, mb: 2 }}>
          {isLogin ? (
            <>
              <LoginForm onLogin={onLogin} />
              <Button
                variant="text"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={toggleForm}
              >
                Create new account
              </Button>
            </>
          ) : (
            <>
              <SignupForm onSignup={toggleForm} />
              <Button
                variant="text"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={toggleForm}
              >
                Back to Login
              </Button>
            </>
          )}
        </Paper>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          © {new Date().getFullYear()} MicroInvest. All rights reserved.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AuthPage;
