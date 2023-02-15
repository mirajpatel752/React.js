import { Card, Image, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { editdataAmount, selectCount } from "../reduxStore/container/container";
import { PlusOutlined } from "@ant-design/icons";
const ShowData = () => {
  const data = useSelector(selectCount);
  const dispatch = useDispatch();
const editdata = (id)=>{
}



  return (
    <>
      {data.map((item) => {
        return (
          <>
          <Card>
            <h5>Name : {item.name}</h5>
            <h5>Select : {item.select}</h5>
            <h5>Number : {item.number}</h5>
            <h5>Messages : {item.messages}</h5>
            <button onClick={()=>editdata(item)}>edit</button>
            <button>delete</button>
            </Card>
          </>
        );
      })}
    </>
  );
};

export default ShowData;
