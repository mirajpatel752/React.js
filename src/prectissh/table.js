import React from "react";

const UserTable = props => (
  <table>
    <thead>
      <tr>
        <th>title</th>
        <br /><br />
        <th>image</th>
        <br /><br />
        <th>description</th>
      </tr>
    </thead>
    <tbody>
      {props.users.length > 0 ? (
        props.users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td><br />
            <img style={{ height: "70px" }} src={user.img} alt="img" /><br />
            <td>{user.username}</td><br />
            <td>
              <button
                onClick={() => {
                  props.editRow(user);
                }}
              >
                Edit
              </button>
              <br /><br />
              <button
                onClick={() => props.deleteUser(user.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3}>No users</td>
        </tr>
      )}
    </tbody>
  </table>
);

export default UserTable;
