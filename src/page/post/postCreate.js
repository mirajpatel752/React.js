import React from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  message,
} from "antd";
import { v4 as uuidv4 } from "uuid";

const PostCreate = ({
  data,
  setData,
  modal,
  setModal,
  editData,
  edit,
  setProducts,
}) => {
  const [form] = Form.useForm();

  const handleFormSubmit = (values) => {
    values.id = uuidv4();
    if (!edit) {
      const updatedData = [...data];
      updatedData.push(values);
      localStorage.setItem("myData", JSON.stringify(updatedData));
      setData(updatedData);
      setProducts(updatedData);
      setModal(false);
      message.success("Data saved successfully!");
      form.resetFields();
    } else {
      const updatedData = [...data];
      const existingIndex = data.findIndex((item) => item.id === editData.id);
      updatedData[existingIndex] = values;
      localStorage.setItem("myData", JSON.stringify(updatedData));
      setData(updatedData);
      setProducts(updatedData);
      setModal(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Form submission failed. Please check the errors.");
  };

  // Custom validation for phone number
  const validatePhoneNumber = (_, value) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!value || phoneRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject("Please enter a valid phone number.");
  };

  return (
    <div>
      <Modal
        title={"Add Record"}
        visible={modal}
        onCancel={() => setModal(false)}
        footer={null}
      >
        <Form
          form={form}
          initialValues={{
            address: editData.address,
            phone: editData.phone,
            name: editData.name,
            email:editData.email,
            phone:editData.phone
          }}
          layout="vertical"
          onFinish={handleFormSubmit}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  {
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone number!",
                  },
                  { validator: validatePhoneNumber },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[
                  {
                    required: false,
                    message: "Please enter your date of birth!",
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address!" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostCreate;
