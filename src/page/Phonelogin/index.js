import React, { useState } from "react";
import firebase from "../../firebase";

const Phonelogin = () => {
  const [num, setNum] = useState(0);
  const [name, setName] = useState("");
  const phlogin = () => {
    var phoneNumber = +916264766485;
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
      })
      .catch(function (error) {
        // Error; SMS not sent
        // ...
      });

    var code = 123456;
    confirmationResult
      .confirm(code)
      .then(function (result) {
        // User signed in successfully.
        var user = result.user;
        // ...
      })
      .catch(function (error) {
        // User couldn't sign in (bad verification code?)
        // ...
      });
  };

  return (
    <>
      <input type="number" onChange={(e) => setNum(e.target.value)} />
      <button
        onClick={() => {
          phlogin();
        }}
      >
        {" "}
        Login With Phone
      </button>
    </>
  );
};

export default Phonelogin;
