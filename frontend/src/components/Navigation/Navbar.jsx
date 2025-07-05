import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function Navbar({ user, onLogout }) {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 1, md: 3 },
          py: { xs: 1, md: 1.5 },
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        {/* App Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            mb: { xs: 1, sm: 0 },
          }}
        >
          MicroInvest
        </Typography>

        {/* Navigation Links */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {user ? (
            <>
              <Button
                component={RouterLink}
                to="/dashboard"
                color="inherit"
                sx={{
                  mr: { xs: 0, sm: 2 },
                  mb: { xs: 1, sm: 0 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Dashboard
              </Button>
              <Button
                component={RouterLink}
                to="/bank-link"
                color="inherit"
                sx={{
                  mr: { xs: 0, sm: 2 },
                  mb: { xs: 1, sm: 0 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Bank Linking
              </Button>
              <Button
                onClick={onLogout}
                color="secondary"
                variant="contained"
                sx={{
                  ml: { xs: 0, sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                }}
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
              sx={{ width: { xs: "100%", sm: "auto" } }}
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
