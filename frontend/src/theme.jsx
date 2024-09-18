// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Main blue shade
      light: "#63a4ff",
      dark: "#004ba0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#90caf9", // Lighter blue shade
      light: "#c3fdff",
      dark: "#5d99c6",
      contrastText: "#000",
    },

    text: {
      primary: "#000000", //Black for text
      secondary: "#0d47a1", // Slightly lighter blue for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
