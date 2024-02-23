import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./Page/Profile";
import Home from "./Page/HomePage";
import Header from "./Page/layout";
import About from "./Page/About";
import Product from "./Page/Product";

function App() {
  return (
    <BrowserRouter basename="/">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/about" element={<About />} /> 
        <Route path="/product" element={<Product />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
