import { Image, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectCount } from "../reduxStore/container/container";
import { PlusOutlined } from "@ant-design/icons";
const ShowData = () => {
  const count = useSelector(selectCount);
  console.log(count, "count");
  return (
    <>
      {count.map((item) => {
        return (
          <>
            <h5>{item.name}</h5>
            <h5>{item.select}</h5>
            <h5>{item.number}</h5>
            <h5>{item.messages}</h5>
            <Image width={200} src={item.image} />
          </>
        );
      })}
    </>
  );
};

export default ShowData;
