import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import "./index.css";
import App from "./App";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#141414'
    },
    secondary: {
      main: '#7b1173'
    }
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root"),
);
