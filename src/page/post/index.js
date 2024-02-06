import React, { useEffect, useState } from "react";
import { Button, Table, Space, Popconfirm, message, Row } from "antd";
import PostCreate from "./postCreate";

const Post = () => {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [editData, setEditData] = useState();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("myData")) || [];
    setData(storedData);
  }, []);

  const handleDelete = (id) => {
    // Delete item from data and update local storage
    const updatedData = data.filter((item) => item.id !== id);
    localStorage.setItem("myData", JSON.stringify(updatedData));

    // Update state
    setData(updatedData);
    message.success("Record deleted successfully!");
  };

  const onEditRow = (value, index) => {
    console.log(index, "@");
    setEditData(value);
    setModalEdit(true);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record, index) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure you want to delete this record?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link">Delete</Button>
          </Popconfirm>
          <Button type="link" onClick={() => onEditRow(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <Row>
        <Button className="mb-3" onClick={() => setModal(true)}>Add</Button>
      </Row>
      <Table dataSource={data} columns={columns} />;
      {modal && (
        <PostCreate
          data={data}
          setData={setData}
          modal={modal}
          setModal={setModal}
        />
      )}
      {modalEdit && (
        <PostCreate
          edit={true}
          data={data}
          setData={setData}
          modal={modalEdit}
          editData={editData}
          setModal={setModalEdit}
        />
      )}
    </div>
  );
};

export default Post;
