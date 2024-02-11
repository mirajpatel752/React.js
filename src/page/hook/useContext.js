import React, { useContext } from "react";

const ThemeContext = React.createContext("light");

function ThemeToggle() {
  const theme = useContext(ThemeContext);

  return (
    <button
      style={{
        background: theme === "light" ? "#fff" : "#000",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
      Toggle Theme
    </button>
  );
}

export default ThemeToggle;
