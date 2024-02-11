import React, { useState } from "react";

function UseState() {
  // Declare a state variable called count, and a function to update it, setCount
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default UseState;
