import React, { useState, useEffect } from "react";

const Showfild = (props) => {
  const initialFormState = { id: null, name: "", username: "" };
  const [user, setUser] = useState(
    props.editing ? props.currentUser : initialFormState
  );
  const handleInputChange = (event, flog) => {
    console.log(event, "event");
    console.log(flog, "flog");
    const { name, value, files } = event.target;
    if (flog) {
      setUser({ ...user, [name]: value });
    } else {
      setUser({ ...user, [name]: URL.createObjectURL(files[0]) });
    }
  };

  useEffect(() => {
    setUser(props.currentUser);
  }, [props]);

  const resetAddUser = () => {
    props.setEditing(false);
    setUser(initialFormState);
    props.setCurrentUser(initialFormState);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!user.name || !user.username) return;
        props.editing ? props.updateUser(user.id, user) : props.addUser(user);
        resetAddUser();
      }}
    >
      <br />
      <label>Name</label> <br />
      <input
        type="text"
        name="name"
        value={user.name}
        onChange={(event) => handleInputChange(event, true)}
      />
      <br /> <br />
      <label>image</label> <br />
      <input
        type="file"
        id="img"
        name="img"
        accept="image/*"
        onChange={(event) => handleInputChange(event, false)}
      />
      <br />
      <img style={{ height: "70px" }} src={user.img} alt="img" />
      <br /> <br />
      <label>Username</label> <br />
      <input
        type="text"
        name="username"
        value={user.username}
        onChange={(event) => handleInputChange(event, true)}
      />
      <br /> <br />
      <button onClick={() => props.setAddblog(true)}>
        {props.editing ? "Update user" : "save"}
      </button>
      
      {props.editing && (
        <button onClick={resetAddUser} className="button muted-button">
          Cancel
        </button>
      )}
    </form>
  );
};

export default Showfild;
