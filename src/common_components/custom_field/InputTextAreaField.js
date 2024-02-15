import React from 'react'
// ** Reactstrap Imports
import { FormFeedback, Input, Label } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { handleFocusTab } from '../../helper/commonFunction'

const InputTextAreaField = ({ value, placeholder, name, handleChange, label, handleBlur, disabled, autoFocus, maxLength, minLength, min, max, errors, touched, tooltipText, rows, isRequired, className, handleFocus, nextFocusId }) => {
    const history = useHistory()
    return (
        <>
            <div className='munim-max-charat'>
                {label ? <Label className={`form-label ${tooltipText ? 'd-flex align-items-center' : ''} ${isRequired === true ? 'required-star' : ''}`} for={label}>
                    {label}
                </Label> : ''}
                <Input
                    value={value}
                    placeholder={disabled && history.location.pathname.includes('view') ? '-' : placeholder}
                    name={name}
                    id='munim-text-area'
                    onChange={!disabled ? (e) => handleChange(name, e.target.value) : () => { }}
                    onBlur={() => handleBlur(name)}
                    autoComplete='true'
                    type='textarea'
                    rows={rows}
                    onKeyDown={nextFocusId ? (e) => handleFocusTab(e, nextFocusId) : () => { }}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    maxLength={maxLength}
                    minLength={minLength}
                    min={min}
                    max={max}
                    invalid={errors && touched && true}
                    className={className}
                    onFocus={handleFocus}
                />
                {errors && touched && (
                    <FormFeedback tooltip={true}>
                        {errors}
                    </FormFeedback>
                )}
                {maxLength ? disabled ? '' : <div className='max-charat'>{maxLength - value?.length}</div> : ''}
            </div>
        </>
    )
}

export default InputTextAreaField
