import React, { useState } from 'react'
// ** Reactstrap Imports
import { FormFeedback, Input, Label } from 'reactstrap'
const InputTextField = ({ value, placeholder, name, handleChange, label, secondHandleBlur, handleBlur, disabled, toUpperCase, onKeyPress, autoFocus, maxLength, minLength, min, max, errors, touched, tooltipText, handleFocus, isRequired, className, id, nextFocusId }) => {
    const [focus, setFocus] = useState(false)
    return (
        <>
            {label ? <Label className={`form-label munim-font-color ${tooltipText ? '' : ''} ${isRequired === true && !disabled ? 'required-star' : ''} ${tooltipText && isRequired ? 'munim-tooltip-required-field' : ''}`} for={label}>
                {label}
            </Label> : ''}
            <Input
                value={value}
                placeholder={placeholder}
                name={name}
                className={className}
                onChange={!disabled ? (e) => handleChange(name,  e.target.value) : () => { }}
                onBlur={secondHandleBlur ? () => { handleBlur(name); secondHandleBlur() } : () => handleBlur(name)}
                autoComplete='true'
                type='text'
                id={id ? id : name}
                autoFocus={autoFocus}
                disabled={disabled}
                onFocus={handleFocus ? () => { setFocus(true); handleFocus() } : () => setFocus(true)}
                onKeyPress={(event) => {
                    if (onKeyPress && !onKeyPress.test(event.key)) {
                        event.preventDefault()
                    }
                }}
                maxLength={maxLength}
                minLength={minLength}
                min={min}
                max={max}
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

export default InputTextField
