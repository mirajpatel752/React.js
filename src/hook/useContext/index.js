import A from "./A";
import React, { createContext } from "react";

const themes = {
  light: {
    color: "red",
    background: "#eeeeee",
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222",
  },
};

let person = {
  name: "John",
  age: 20,
};

const ThemeContext = createContext(themes.light);
const FastName = createContext(person);

const Context = () => {
  return (
    <>
      <ThemeContext.Provider value={themes.light}>
        <FastName.Provider value={person}>
          <A />
        </FastName.Provider>
      </ThemeContext.Provider>
    </>
  );
};
export default Context;
export { ThemeContext };
export { FastName };
