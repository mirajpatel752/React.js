import React from 'react'
import { Input, Label } from 'reactstrap'
const CustomToggle = ({ label, checkedLabel, uncheckedLabel, value, handleChange, name, disabled, custom_field }) => {
    return (
        <>
            <div className='form-check form-switch d-flex justify-content-center align-items-center gap-1 munim-toggle-gst m-auto p-xl-0 p-md-0 p-sm-0'>
                {!custom_field ? <Label for='icon-primary' className='form-check-label'>
                    {label}
                </Label> : ''}
                <div className='form-switch form-check-primary'>
                    <Input type='switch' checked={value} onChange={!disabled ? () => handleChange() : () => { }} id={name} name={name} disabled={disabled} />
                    <Label className='form-check-label' htmlFor={name}>
                        <span className='switch-icon-left'>
                            {checkedLabel}
                        </span>
                        <span className='switch-icon-right'>
                            {uncheckedLabel}
                        </span>
                    </Label>
                </div>
                {custom_field ? <Label for='icon-primary' className='form-check-label'>
                    {label}
                </Label> : ''}
            </div>
        </>
    )
}
export default CustomToggle