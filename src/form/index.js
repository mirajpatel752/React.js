import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { addTag, setActiveTag } from "../store/tags-view.store";
import { useDispatch, useSelector } from 'react-redux';
import ShowData from "./show";
const { TextArea } = Input;

const FormDisabledDemo = () => {
  const [data, setData] = useState({
    name: "",
    number: 0,
    select: "",
    messages: "",
    id: null,
  });

  const dispatch = useDispatch();
  const {tags, activeTagId} = useSelector(state => state.tagsView);
  console.log(tags)
  const onFormLayoutChange = (value) => {
    data.id = tags.length + 1;
    dispatch(addTag(data));
  };

  const oncheng = (event, flog) => {
    if (!flog) {
      const { name, value, files } = event.target;
      setData({ ...data, [name]: value });
    } else {
      setData({ ...data, ["number"]: event });
    }
  };


  return (
    <>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="vertical"
        onFinish={onFormLayoutChange}
        onFinishFailed={onFormLayoutChange}
        style={{
          maxWidth: 500,
        }}
      >
        <Form.Item
          label="Input"
          name="name"
          rules={[
            {
              required: false,
              message: "Please input your name !",
            },
          ]}
        >
          <Input value={data.name} name="name" onChange={(event) => oncheng(event)} />
        </Form.Item>
        <Form.Item label="Select" name="select">
          <select
            id="select"
            name="select"
            value={data.select}
            onChange={(event) => oncheng(event)}
          >
            <option value="One">One</option>
            <option value="Two">Two</option>
            <option value="Three">Three</option>
          </select>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: false,
              message: "Please input your number !",
            },
          ]}
          label="InputNumber"
          name="number"
        >
          <InputNumber
            name="number"
            value={data.number}
            onChange={(event) => oncheng(event, true)}
          />
        </Form.Item>
        <Form.Item label="TextArea" name="messages">
          <TextArea
            name="messages"
            value={data.messages}
            onChange={(event) => oncheng(event)}
            rows={4}
          />
        </Form.Item>

        <Form.Item label="Upload" name="image">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </div>
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Primary Button
        </Button>
      </Form>
      <ShowData />
    </>
  );
};
export default () => <FormDisabledDemo />;
