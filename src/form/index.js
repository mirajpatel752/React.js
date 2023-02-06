import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";

import { useSelector, useDispatch } from 'react-redux';
import { incrementByAmount, selectCount } from "../reduxStore/container/container";
import ShowData from "./show";
const { TextArea } = Input;

const FormDisabledDemo = () => {


  const [incrementAmount, setIncrementAmount] = useState([]);
const incrementValue = incrementAmount || [];

  const dispatch = useDispatch();

  const  data = [
    {
      name : "bhanderi",
      email: "bhannderi mira@gmail.com",
    }
  ]

  const count = useSelector(selectCount);
  console.log(count,"count")

  const onFormLayoutChange = (value) => {
    dispatch(incrementByAmount([value]))
    // setIncrementAmount(value);
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
        <Form.Item label="Input" name="name"  rules={[
        {
          required: false,
          message: 'Please input your name !',
        },
      ]}>
          <Input  />
        </Form.Item>
        <Form.Item label="Select" name="select">
          <Select >
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item  rules={[
        {
          required: false,
          message: 'Please input your number !',
        },
      ]} label="InputNumber" name="number">
          <InputNumber  />
        </Form.Item>
        <Form.Item label="TextArea" name="messages">
          <TextArea  rows={4} />
        </Form.Item>

        <Form.Item label="Upload"  name="image">
          <Upload  action="/upload.do" listType="picture-card">
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
