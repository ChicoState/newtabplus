import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <title>New Tab</title>
    <meta name="darkreader-lock"></meta>
    <App />
  </React.StrictMode>,
);
