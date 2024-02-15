import React from 'react'
// ** Reactstrap Imports
import { FormFeedback, Input, Label } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { handleFocusTab } from '../../helper/commonFunction'

const InputNumberField = ({ value, placeholder, name, handleChange, handleBlur, secondHandleBlur, disabled, label, handleFocus, tooltipText, maxLength, minLength, min, max, errors, touched, maxNumber, isRequired, className, id, onHoverTooltip, nextFocusId }) => {
    const history = useHistory()
    return (
        <>
            {label ? <><Label key={`${name}.1`} className={`form-label ${tooltipText ? '' : ''}`} for={label}>
                {label}
                {isRequired && !disabled ? <span className={`${isRequired === true && !disabled ? 'required-star-number' : ''}`}>*</span> : ''}
            </Label> </> : ''}

            <Input
                value={value}
                id={id ? id : name}
                placeholder={disabled && history.location.pathname.includes('view') ? '-' : placeholder}
                name={name}
                className={className}
                // onChange={(e) => handleChange(name, Number(e.target.value) <= 0 ? '' : maxNumber && (e.target.value > Number(maxNumber)) ? maxNumber : e.target.value)}
                onChange={!disabled ? (e) => (maxLength ? e.target.value.length <= maxLength ? handleChange(name, (maxNumber && (e.target.value > Number(maxNumber))) ? maxNumber : e.target.value) : e.target.value : handleChange(name, (maxNumber && (e.target.value > Number(maxNumber))) ? maxNumber : e.target.value)) : () => { }}
                onBlur={secondHandleBlur ? () => { handleBlur(name); secondHandleBlur() } : () => handleBlur(name)}
                autoComplete='true'
                onFocus={handleFocus}
                type='number'
                disabled={disabled}
                maxLength={maxLength}
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
                minLength={minLength}
                min={min}
                max={max}
                invalid={errors && touched && true}
            />
            {onHoverTooltip ? <div className='error-hover-tooltip'></div> : ''}
            {onHoverTooltip ? errors && touched && (
                <div className='custom-tooltip'>
                    <div className='custom-tooltip-label'>
                        <p> {errors}</p>
                    </div>
                </div>
            ) : errors && touched && (
                <FormFeedback tooltip={true}>
                    {errors}
                </FormFeedback>
            )}

        </>
    )
}

export default InputNumberField
