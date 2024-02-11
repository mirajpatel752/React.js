import React, { useState, useEffect } from 'react';

function UseEffect() {
  const [seconds, setSeconds] = useState(0);

  // useEffect is used to update the timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);

    // Cleanup function to clear interval when component unmounts or rerenders
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <div>
      <p>Timer: {seconds} seconds</p>
    </div>
  );
}

export default UseEffect;
