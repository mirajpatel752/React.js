import ThemeToggle from "./useContext";
import UseEffect from "./useEffect";
import ReducerPage from "./useReducer";
import UseState from "./useState";

const Hook = () => {
  return (
    <>
      UseState
      <UseState />
      <hr />
      UseEffect
      <UseEffect />
      <hr />
      useContext
      <ThemeToggle />
      <hr />
      useReducer
      <ReducerPage />
      <hr />
    </>
  );
};
export default Hook;
