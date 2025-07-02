import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Grid, Box, Typography, Paper, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AuthPage = ({ onLogin }) => {
  // State to track whether we're showing login (true) or signup (false)
  const [isLogin, setIsLogin] = useState(true);
  const theme = useTheme();

  // Function to switch between login and signup
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left side: Branding/Tagline + Illustration */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          bgcolor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: { xs: "center", md: "flex-end" },
          pr: { xs: 2, md: 8 },
          pl: { xs: 2, md: 8 },
          py: { xs: 4, md: 0 },
        }}
      >
        <Box sx={{ maxWidth: 400, width: "100%" }}>
          <Typography
            variant="h4"
            color="primary"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            MicroInvest
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{
              fontSize: { xs: "1.1rem", md: "1.5rem" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Invest your spare change. Grow your future.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: { xs: "center", md: "left" } }}
          >
            Secure, simple, and smart micro-investing for everyone.
          </Typography>
          {/* Illustration: hide on mobile */}
          <Box
            sx={{
              width: "100%",
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-start",
            }}
          >
            <img
              src="/Savings-bro.svg"
              alt="Money illustration"
              style={{ maxWidth: 320, width: "100%", height: "auto" }}
            />
          </Box>
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
          alignItems: { xs: "center", md: "flex-start" },
          bgcolor: theme.palette.background.paper,
          pl: { xs: 2, md: 8 },
          pr: { xs: 2, md: 8 },
          py: { xs: 4, md: 0 },
        }}
      >
        <Paper
          elevation={4}
          sx={{ width: "100%", maxWidth: 400, p: { xs: 2, md: 4 }, mb: 2 }}
        >
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
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, textAlign: { xs: "center", md: "left" }, width: "100%" }}
        >
          © {new Date().getFullYear()} MicroInvest. All rights reserved.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AuthPage;
