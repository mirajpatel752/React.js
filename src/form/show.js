import { Button, Card, Image, Upload } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { removeAllTag, removeTag } from "../store/tags-view.store";
const ShowData = () => {
  const dispatch = useDispatch();
const editdata = (id)=>{
  dispatch(removeAllTag());
}
const removeAll = (id)=>{
  dispatch(removeAllTag());
}

const deletedata = (id)=>{
  dispatch(removeTag(id));
}

const {tags, activeTagId} = useSelector(state => state.tagsView);

  return (
    <>
      {tags.map((item) => {
        return (
          <>
          <Card>
            <h5>Name : {item.name}</h5>
            <h5>Select : {item.select}</h5>
            <h5>Number : {item.number}</h5>
            <h5>Messages : {item.messages}</h5>
            <button onClick={()=>editdata(item.id)}>edit</button>
            <button onClick={()=>deletedata(item.id)}>delete</button>
            </Card>
          </>
        );
      })}
      <Button onClick={()=>removeAll()}>RemoveAll</Button>
    </>
  );
};

export default ShowData;
