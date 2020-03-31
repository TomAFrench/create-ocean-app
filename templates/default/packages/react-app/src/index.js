import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, pink } from '@material-ui/core/colors';

import "./index.css";
import App from "./App";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900]
    },
    secondary: pink,
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root"),
);
