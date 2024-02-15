import React, { useState } from 'react'
// ** Reactstrap Imports
import { FormFeedback, Input, Label } from 'reactstrap'
import { isUserLoggedIn } from '@utils'
import { useHistory } from 'react-router-dom'
const InputEmailField = ({ value, placeholder, name, handleChange, handleBlur, label, autoFocus, disabled, errors, touched, isRequired, className, maxLength, handleOnKeyUp }) => {
    const [focus, setFocus] = useState(false)
    const history = useHistory()
    return (
        <>
            {label ? <Label className={`form-label munim-font-color ${isRequired === true && !disabled ? 'required-star' : ''}`} for={label}>
                {label}
            </Label> : ''}
            <Input
                value={value}
                placeholder={disabled && history.location.pathname.includes('view') ? '-' : placeholder}
                name={name}
                className={className}
                onKeyUp={handleOnKeyUp}
                onChange={!disabled ? (e) => handleChange(name, isUserLoggedIn() ? focus ? (e.target.value).toLowerCase() : '' : (e.target.value).toLowerCase()) : () => { }}
                onBlur={() => handleBlur(name)}
                autoFocus={autoFocus}
                onFocus={() => setFocus(true)}
                autoComplete='true'
                type='email'
                id={name}
                onInput={(e) => { e.target.value = (e.target.value).toLowerCase() }}
                disabled={disabled}
                invalid={errors && touched && true}
                maxLength={maxLength}
            />
            {errors && touched && (
                <FormFeedback tooltip={true}>
                    {errors}
                </FormFeedback>
            )}
        </>
    )
}

export default InputEmailField
