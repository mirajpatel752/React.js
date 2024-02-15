import React, { Fragment } from 'react'
import { Label, Input } from 'reactstrap'
function MultipleRadioButton({ name, label, disabled, handleChange, value }) {
    return (
        <>
            <div key={name} className='munim-form-radio'>
                {label.map((item, index) => <Fragment key={`${item}_${index}`}>
                    {item ? <div key={`${name}_${index}`} className='form-check' onClick={() => !disabled && handleChange(name, index)}>
                        <Input type='radio' id={`${name}_${index}`} name={name} checked={value === index} onChange={() => { }} disabled={disabled} />
                        <Label className='form-check-label' for={`${name}_${index}`}>
                            {item}
                        </Label>
                    </div> : null}
                </Fragment>
                )}
            </div>

        </>
    )
}

export default MultipleRadioButton
