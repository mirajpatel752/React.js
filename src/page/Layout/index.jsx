// Layout.js
import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;

const Header = () => {
  return (
    <header className="bg-gray-800 py-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          My Website
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile" className="text-white hover:text-gray-300">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-white hover:text-gray-300">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
