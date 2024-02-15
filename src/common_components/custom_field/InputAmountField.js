import React from 'react'
// ** Reactstrap Imports
import { FormFeedback, Input, Label } from 'reactstrap'
import { handleFocusTab } from '../../helper/commonFunction'

const InputAmountField = ({ value, placeholder, name, handleChange, handleBlur, secondHandleBlur, disabled, label, handleFocus, tooltipText, minLength, min, max, errors, touched, isRequired, className, maxLength, decimal_places = 2, nextFocusId }) => {
    return (
        <>
            {label ? <Label className={`form-label ${tooltipText ? 'd-flex align-items-center' : ''} ${isRequired === true && !disabled ? 'required-star' : ''}`} for={label}>
                {label}
            </Label> : ''}
            <Input
                value={value}
                id={name}
                placeholder={disabled ? '0.00' : placeholder}
                className={className}
                name={name}
                onChange={!disabled ? (e) => handleChange(name, e.target.value.includes('.') && e.target.value.split('.')[1].length > decimal_places ? Number(e.target.value).toFixed(decimal_places) : e.target.value) : () => { }}
                onBlur={secondHandleBlur ? () => { handleBlur(name); secondHandleBlur() } : () => handleBlur(name)}
                autoComplete='true'
                onFocus={handleFocus}
                type='number'
                onKeyDown={(event) => {
                    if (/^[0-9\b]+$/.test(event.key)) {
                    } else if (/^[.\b]+$/.test(event.key) && event.target.value.split('.').length < 2) {
                    } else if (event.keyCode === 38 || event.keyCode === 40) {
                        event.preventDefault()
                    } else {

                    }
                    if (nextFocusId) {
                        handleFocusTab(event, nextFocusId)
                    }
                    if (["e", "E", "+", "-"].includes(event.key)) {
                        event.preventDefault()
                    }
                }}

                onWheelCapture={(event) => event.target.blur()}
                disabled={disabled}
                maxLength={maxLength ? maxLength : '10'}
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

export default InputAmountField
