import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "white",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "white",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "black",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "black",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 200,
      color: "black",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 200,
      color: "black",
      wordBreak: "break-word",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
});

export default theme;
