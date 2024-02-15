import React, { useState } from 'react'
// ** Reactstrap Imports
import { FormFeedback, Input, Label } from 'reactstrap'
import { isUserLoggedIn } from '@utils'
const InputPasswordField = ({ value, placeholder, name, handleChange, label, handleBlur, disabled, errors, touched, tooltipText, isRequired, autoFocus }) => {
    const [focus, setFocus] = useState(false)
    return (
        <>
            {label ? <Label className={`form-label ${tooltipText ? 'd-flex align-items-center' : ''} ${isRequired === true ? 'required-star' : ''}`} for={label}>
                {label}
            </Label> : ''}
            <Input
                value={value}
                placeholder={placeholder}
                name={name}
                id={name}
                onChange={!disabled ? (e) => handleChange(name, isUserLoggedIn() ? focus ? e.target.value : '' : e.target.value) : () => { }}
                onBlur={() => handleBlur(name)}
                autoComplete='true'
                type='password'
                onFocus={() => setFocus(true)}
                autoFocus={autoFocus}
                disabled={disabled}
                invalid={errors && touched && true}
            />
            {errors && touched && (
                <FormFeedback tooltip={true}>
                    {errors}
                </FormFeedback>
            )}
        </>
    )
}

export default InputPasswordField
