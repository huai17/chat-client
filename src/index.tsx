import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// url config
const serverUrl =
  process.env.NODE_ENV === "production" ? "http://localhost:5566" : undefined;

ReactDOM.render(
  <React.StrictMode>
    <App serverUrl={serverUrl} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
