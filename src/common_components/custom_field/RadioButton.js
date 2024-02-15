import React from 'react'
import { Label, Input } from 'reactstrap'
import { handleFocusTab } from '../../helper/commonFunction'
function RadioButton(props) {
    return (
        <>
            <div className='munim-form-radio'>
                <div className='form-check' onClick={() => !props.disabled && props.handleChange(props.name, true)}>
                    <Input type='radio' id={`${props.name}_1`} name={props.name} checked={props.value} onKeyDown={props.nextFocusId ? (e) => handleFocusTab(e, props.nextFocusId) : () => { }} onChange={() => { }} disabled={props.disabled} />
                    <Label className='form-check-label d-flex' for={`${props.name}_1`}>
                        {props.label1}
                    </Label>
                </div>
                <div className='form-check' onClick={() => !props.disabled && props.handleChange(props.name, false)}>
                    <Input type='radio' name={props.name} id={`${props.name}_2`} checked={!props.value} onChange={() => { }} onKeyDown={props.nextFocusId ? (e) => handleFocusTab(e, props.nextFocusId) : () => { }} disabled={props.disabled} />
                    <Label className='form-check-label d-flex' for={`${props.name}_2`}>
                        {props.label2}
                    </Label>
                </div>
            </div>

        </>
    )
}

export default RadioButton
