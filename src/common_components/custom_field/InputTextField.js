import React, { useState } from 'react'
// ** Reactstrap Imports
import { FormFeedback, Input, Label } from 'reactstrap'
import HelpTooltip from '../tooltip/HelpTooltip'
import { isUserLoggedIn } from '@utils'
import { useHistory } from 'react-router-dom'
import { handleFocusTab } from '../../helper/commonFunction'
const InputTextField = ({ value, placeholder, name, handleChange, label, secondHandleBlur, handleBlur, disabled, toUpperCase, onKeyPress, autoFocus, maxLength, minLength, min, max, errors, touched, tooltipText, handleFocus, isRequired, className, id, nextFocusId }) => {
    const [focus, setFocus] = useState(false)
    const history = useHistory()
    return (
        <>
            {label ? <Label className={`form-label munim-font-color ${tooltipText ? '' : ''} ${isRequired === true && !disabled ? 'required-star' : ''} ${tooltipText && isRequired ? 'munim-tooltip-required-field' : ''}`} for={label}>
                {label}
                {tooltipText ? <HelpTooltip id={id ? id : name} isRequired={isRequired} label={tooltipText} /> : ''}
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
                onKeyDown={nextFocusId ? (e) => handleFocusTab(e, nextFocusId) : () => { }}
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
