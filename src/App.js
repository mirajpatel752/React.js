import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./Page/Profile";
import Home from "./Page/HomePage";
import Header from "./Page/layout";
import AffordabilityWidget from "./Page/payu";
import "./index.css"
import GoogleLogin from "./Page/GoogleLogin";
import GoogleLoginA from "./Page/GoogleLoginA";

function App() {
  return (
    <BrowserRouter basename="/">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/google-login" element={<GoogleLogin />} /> 
        <Route path="/google-login-a" element={<GoogleLoginA />} /> 
        <Route path="/pay" element={<AffordabilityWidget  key='OADt8R' amount='6000' />} /> 
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
