import React, { useState } from 'react'
// ** Reactstrap Imports
import { Input, Label } from 'reactstrap'
import { isUserLoggedIn } from '@utils'
import { useHistory } from 'react-router-dom'
const InputTextField = ({ value, placeholder, name, handleChange, label, secondHandleBlur, handleBlur, disabled, toUpperCase, onKeyPress, autoFocus, maxLength, minLength, min, max, errors, touched, tooltipText, handleFocus, isRequired, className, id }) => {
    const [focus, setFocus] = useState(false)
    const history = useHistory()
    return (
        <>

            {label ? <Label className={`form-label munim-font-color ${tooltipText ? 'd-flex align-items-center' : ''} ${isRequired === true && !disabled ? 'required-star' : ''} ${tooltipText && isRequired ? 'munim-tooltip-required-field' : ''}`} for={label}>
                {label}
            </Label> : ''}
            <Input
                value={value}
                placeholder={disabled && history.location.pathname.includes('view') ? '-' : placeholder}
                name={name}
                className={className}
                onChange={!disabled ? (e) => handleChange(name, isUserLoggedIn() ? focus ? toUpperCase ? (e.target.value).toUpperCase() : e.target.value : '' : e.target.value) : () => { }}
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
            <div className='error-hover-tooltip'></div>
            {errors && touched && (
                <div className='custom-tooltip'>
                    <div className='custom-tooltip-label'>
                        <p> {errors}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default InputTextField
