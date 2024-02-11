import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./page/dashboard";
import Post from "./page/post";
import Props from "./page/props";
import HOCs from "./page/HOCs/MyComponent";
import Hook from "./page/hook";
import { Component, useState } from "react";
import Portal from "./page/Portal";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // This method is called when an error is thrown in a child component
  static getDerivedStateFromError(error) {
    // Update state to indicate error
    return { hasError: true };
  }

  // This method is called after rendering with the error thrown during rendering
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error boundary caught an error:", error, errorInfo);
  }

  render() {
    // If an error occurred, display a fallback UI
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    // Otherwise, render the children as normal
    return this.props.children;
  }
}

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            }
          />
          <Route path="/post" element={<Post />} />
          <Route path="/props" element={<Props />} />
          <Route path="/hocs" element={<HOCs />} />
          <Route path="/hook" element={<Hook />} />
          <Route path="/portal" element={<Portal />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
