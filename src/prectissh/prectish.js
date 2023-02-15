import { Button } from "antd";
import React, { useState } from "react";
import Showfild from "./showfild";
import UserTable from "./table";

const Prentice = () => {
  const usersData = [];
  const initialFormState = { id: null, name: "", username: "" };
  const [addblog, setAddblog] = useState(false);
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState(usersData);
  const [editing, setEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialFormState);

  const addUser = (user) => {
    user.id = users.length + 1;
    setUsers([...users, user]);
  };

  const deleteUser = (id) => {
    setEditing(false);
    setUsers(users.filter((user) => user.id !== id));
  };

  const editRow = (user) => {
    setEditing(true);
    setCurrentUser(user);
  };

  const updateUser = (id, updatedUser) => {
    setEditing(false);
    setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
  };


  return (
    <>
        <Showfild
          setAddblog={setAddblog}
          editing={editing}
          setEditing={setEditing}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          updateUser={updateUser}
          addUser={addUser}
        />
      {addblog && (
        <UserTable users={users} editRow={editRow} deleteUser={deleteUser} />
      )}
    </>
  );
};

export default Prentice;
