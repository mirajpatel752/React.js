import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./page/dashboard";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Dashboard />} /> 
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
