import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Space,
  Popconfirm,
  message,
  Row,
  DatePicker,
  Input,
  Col,
} from "antd";
import PostCreate from "./postCreate";

const Post = () => {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [editData, setEditData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const { RangePicker } = DatePicker;
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("myData")) || [];
    setProducts(storedData);
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

  // Function to filter data based on search query
  const filterData = (query) => {
    const filtered = products.filter((item) => {
      const { name, email, phone } = item;
      return (
        name.toLowerCase().includes(query.toLowerCase()) ||
        email.toLowerCase().includes(query.toLowerCase()) ||
        phone.includes(query)
      );
    });
    setData(filtered);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    filterData(e.target.value);
  };

  const filterDates = (range) => {
    if (range && range.length === 2) {
      setDateRange(range);
      const [startDate, endDate] = range;
      setData(
        data.filter((dateString) => {
          const date = new Date(dateString.dob);
          return (
            (!startDate || date >= startDate) && (!endDate || date <= endDate)
          );
        })
      );
    }
  };

  return (
    <div className="container mt-4">
      <Row>
        <Col>
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
          />
        </Col>
        <Col>
          <RangePicker onChange={(dates) => filterDates(dates)} />
        </Col>
        <Col>
          <Button className="" onClick={() => setModal(true)}>
            Add
          </Button>
        </Col>
      </Row>
      <Table dataSource={data} columns={columns} />;
      {modal && (
        <PostCreate
          data={data}
          setData={setData}
          setProducts={setProducts}
          modal={modal}
          setModal={setModal}
        />
      )}
      {modalEdit && (
        <PostCreate
          edit={true}
          data={data}
          setData={setData}
          setProducts={setProducts}
          modal={modalEdit}
          editData={editData}
          setModal={setModalEdit}
        />
      )}
    </div>
  );
};

export default Post;
