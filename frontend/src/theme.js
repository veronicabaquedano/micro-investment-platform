import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#62cc75",
    },
    secondary: {
      main: "#1976d2",
    },
    background: {
      default: "#f0f2f5",
      paper: "#fff",
    },
  },
  typography: {
    fontFamily: "'Roboto', Arial, sans-serif",
    h2: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontSize: "1rem" },
    body2: { fontSize: "0.95rem" },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#3de375",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
        },
      },
    },
  },
});

// Enable responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;
