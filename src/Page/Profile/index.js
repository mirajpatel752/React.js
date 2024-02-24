import { Table } from "antd";
import { useEffect, useState } from "react";

const Profile = () => {
  const [state, setState] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://jsonplaceholder.typicode.com/users";
        const response = await fetch(url);
        const data = await response.json();
        setState(data);
        localStorage.setItem("user",JSON.stringify(data))
      } catch (error) {
        // alert("catch block")
       let userData = localStorage.getItem("user")
       setState(JSON.parse(userData))
      }
    };

    fetchData();
  }, []);

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  // console.log(state);
  return (
    <>
      <Table dataSource={state} columns={columns} />;
    </>
  );
};
export default Profile;



// CLIentID = "608745921575-qnqlgtgsuievb5474mh0pvsq91vk4eij.apps.googleusercontent.com"
// clientsecreat = "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"

// "608745921575-qnqlgtgsuievb5474mh0pvsq91vk4eij.apps.googleusercontent.com"