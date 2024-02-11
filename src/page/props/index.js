import ParentComponent from "./ParentComponent";

const Props = () => {
  return (
    <>
      {" "}
      <Greeting name="John" />
      <br />
        //React.js, prop drilling //
      <ParentComponent />
    </>
  );
};
export default Props;

const Greeting = (props) => {
  const { name } = props;

  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};
