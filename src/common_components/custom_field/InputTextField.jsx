import React, { useState } from "react";
// ** Reactstrap Imports
import { FormFeedback, Input, Label } from "reactstrap";
const InputTextField = ({
  value,
  placeholder,
  name,
  handleChange,
  label,
  secondHandleBlur,
  handleBlur,
  disabled,
  onKeyPress,
  autoFocus,
  maxLength,
  minLength,
  min,
  max,
  errors,
  touched,
  tooltipText,
  handleFocus,
  isRequired,
  className,
  id,
}) => {
  const [focus, setFocus] = useState(false);
  return (
    <>
      {label ? (
        <Label
          className={`form-label ${tooltipText ? "" : ""} ${
            isRequired === true && !disabled ? "required-star" : ""
          } ${tooltipText && isRequired ? "" : ""}`}
          for={label}
        >
          {label}
        </Label>
      ) : (
        ""
      )}
      <Input
        value={value}
        placeholder={placeholder}
        name={name}
        className={`${className} input-box`}
        onChange={
          !disabled ? (e) => handleChange(name, e.target.value) : () => {}
        }
        onBlur={
          secondHandleBlur
            ? () => {
                handleBlur(name);
                secondHandleBlur();
              }
            : () => handleBlur(name)
        }
        autoComplete="true"
        type="text"
        id={id ? id : name}
        autoFocus={autoFocus}
        disabled={disabled}
        onFocus={
          handleFocus
            ? () => {
                setFocus(true);
                handleFocus();
              }
            : () => setFocus(true)
        }
        onKeyPress={(event) => {
          if (onKeyPress && !onKeyPress.test(event.key)) {
            event.preventDefault();
          }
        }}
        maxLength={maxLength}
        minLength={minLength}
        min={min}
        max={max}
        invalid={errors && touched && true}
      />
      {errors && touched && (
        <FormFeedback tooltip={true}>{errors}</FormFeedback>
      )}
    </>
  );
};

export default InputTextField;
