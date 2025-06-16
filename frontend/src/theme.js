import { createTheme } from "@mui/material/styles";

const theme = createTheme({
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
    h5: { fontWeight: 500 },
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
  },
});

export default theme;
