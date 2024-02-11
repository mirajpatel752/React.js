import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./page/dashboard";
import Post from "./page/post";
import Props from "./page/props";
import HOCs from "./page/HOCs/MyComponent";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/post" element={<Post />} />
        <Route path="/props" element={<Props />} />
        <Route path="/hocs" element={<HOCs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
