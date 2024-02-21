import InputTextField from "@/common_components/custom_field/InputTextField";
import ValidationMessage from "@/common_components/tooltip/Validation";
import commonRegex from "@/helper/constants";
import {  Form, Formik, useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
const Profile = () => {
  const [initialState] = useState({
    name: "",
    email: "",
    phone: "",
    phone: "",
    message: "",
  });
  const companySchema = yup.object().shape({
    name: yup.string().trim().required(ValidationMessage.is_require),
    mobile: yup
      .string()
      .trim()
      .matches(commonRegex.mobile_no, ValidationMessage.mn_not_valid)
      .required(ValidationMessage.is_require),
    email: yup
      .string()
      .trim()
      .required(ValidationMessage.is_require)
      .email(ValidationMessage.valid_email)
      .matches(commonRegex.emailRegex, ValidationMessage.valid_email)
      .max(255),
  });
  const handleSave = (value) => {
    console.log("come", value);
  };
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: companySchema,
    enableReinitialize: true,
    onSubmit: (value) => {
      handleSave(value);
    },
  });


  return (
    <>
    <Formik initialValues={initialState}>
      <Form >
        <InputTextField
          value={formik.values.name}
          isRequired={true}
          placeholder="placeholder"
          label="name"
          name="name"
          handleChange={formik.setFieldValue}
          handleBlur={formik.setFieldTouched}
          autoComplete={"off"}
          disabled={false}
          errors={formik.errors.name}
          touched={formik.touched.name}
        />{" "}
        <button type="submit">Save</button>
      </Form>
      </Formik>
    </>
  );
};

export default Profile;
