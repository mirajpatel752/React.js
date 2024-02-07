import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./page/dashboard";
import Post from "./page/post";
// import PostCreate from "./page/post";
import ImageRouter from "./page/ImageRouter";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/post" element={<Post />} />
        <Route path="/image" element={<ImageRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
