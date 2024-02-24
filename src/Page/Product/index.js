import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
const Product = () => {
    const [data,setData] = useState()

    console.log(data,"data")
    
  return (
    <>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
            const  credentialResponseDecode = jwtDecode(
                credentialResponse.credential
            );
            setData(credentialResponseDecode)
          console.log(credentialResponseDecode);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </>
  );
};
export default Product;
