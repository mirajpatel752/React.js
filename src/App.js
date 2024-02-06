import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./page/dashboard";
import Post from "./page/post";
import PostCreate from "./page/post";
import CRUDApp from "./page/post/postCreate";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/post" element={<Post />} />
        {/* <Route path="/crud" element={<CRUDApp />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
