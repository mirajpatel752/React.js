//

import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./page/dashboard";
import Layout from "./page/Layout";
import Profile from "./page/profile";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
