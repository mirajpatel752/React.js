import React from 'react'
import { useHistory } from 'react-router-dom'
// ** Reactstrap Imports
import { Input, Label } from 'reactstrap'
import { getIcon, handleFocusTab } from '../../helper/commonFunction'

const InputCheckBoxField = ({ value, placeholder, name, onChange, checked, onBlur, id, disabled, defaultChecked, label, onFocus, className, paddingUnset, nextFocusId, image, isShowImage = false }) => {
    const history = useHistory()
    return (
        <>
            {!history.location.pathname.includes('view') ? <Input
                className={className}
                value={value}
                placeholder={placeholder}
                name={name}
                id={id}
                onChange={!disabled ? (e) => { onChange(e) } : () => { }}
                onBlur={onBlur}
                onFocus={onFocus}
                onKeyDown={nextFocusId ? (e) => handleFocusTab(e, nextFocusId) : () => { }}
                autoComplete='true'
                type='checkbox'
                defaultChecked={defaultChecked}
                checked={checked}
                disabled={disabled}
                role='button'
            /> : ''}
            {isShowImage ? <span onClick={!disabled ? (e) => { e.preventDefault(); onChange(e) } : () => { }}>{image ? <img src={image} width='20px' height='20px' /> : getIcon('EmptyImage')}</span> : ''}
            {label ? <Label onClick={!disabled ? (e) => { e.preventDefault(); onChange(e) } : () => { }} for={id} className={` form-check-label ${paddingUnset}`}>
                {label}
            </Label> : ''}
        </>
    )
}

export default InputCheckBoxField
