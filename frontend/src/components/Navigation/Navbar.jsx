import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function Navbar({ user, onLogout }) {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* App Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}
        >
          MicroInvest
        </Typography>

        {/* Navigation Links */}
        <Box>
          {user ? (
            <>
              <Button
                component={RouterLink}
                to="/dashboard"
                color="inherit"
                sx={{ mr: 2 }}
              >
                Dashboard
              </Button>
              <Button
                component={RouterLink}
                to="/bank-link"
                color="inherit"
                sx={{ mr: 2 }}
              >
                Bank Linking
              </Button>
              <Button
                onClick={onLogout}
                color="secondary"
                variant="contained"
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={RouterLink}
              to="/auth"
              color="inherit"
              variant="outlined"
            >
              Login / Signup
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
