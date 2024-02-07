import { Row } from "antd";
import { useEffect, useState } from "react";

const ImageRouter = () => {
  const [array, setArray] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);

  // Function to shuffle the array
  const shuffleArray = (arr) => {
    const shuffledArray = [...arr];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };
  useEffect(() => {
    setArray(shuffleArray(array));
  }, []);
  return (
    <>
      {" "}
      <div>
        <Row>
          {array.map((item, index) => (
            <Row key={index}>
              <span>&nbsp; {item},&nbsp; </span>
            </Row>
          ))}
        </Row>
      </div>
    </>
  );
};
export default ImageRouter;
