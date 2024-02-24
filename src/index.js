import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import swDev from "./swDev";
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="608745921575-qnqlgtgsuievb5474mh0pvsq91vk4eij.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
swDev();
