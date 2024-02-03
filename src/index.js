import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import rootReducer from "./page/redux";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));

const store = configureStore({ reducer: rootReducer });
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
