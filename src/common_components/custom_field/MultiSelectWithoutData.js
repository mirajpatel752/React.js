import React, { useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import { Label, Input, FormFeedback } from 'reactstrap'
function MultiSelectWithoutData({ name, value, handleChange, errors, touched, disabled, handleBlur }) {
    const [inputValue, setInputValue] = useState('')
    const addValueOnBlur = (element) => {
        handleBlur(name)
        if (element.target.value.trim() && !value.includes(element.target.value.trim())) {
            handleChange(name, [...value, element.target.value.trim()])
        }
        setInputValue('')
    }
    return (
        <>
            <Autocomplete
                multiple
                id={name}
                value={value}
                inputValue={inputValue}
                disableClearable
                className={`munim-MUI-dropdown munim-sidebar-tags ${errors && touched ? 'is-invalid' : ''}`}
                options={[]}
                slotProps={{
                    popper: {
                        className: 'munim-multi-select-mui'
                    }
                }}
                freeSolo={true}
                onKeyDown={(element) => {
                    if (element.keyCode === 32) {
                        setInputValue('')
                        if (element.target.value.trim() && !value.includes(element.target.value.trim())) {
                            handleChange(name, [...value, element.target.value.trim()])
                        }
                    }
                }}
                onInputChange={(e) => setInputValue(e.target.value)}
                onBlur={(e) => addValueOnBlur(e)}
                disabled={disabled}
                onChange={!disabled ? (e, value) => { setInputValue(''); handleChange(name, value) } : () => { }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        className={`${errors && touched && 'munim-sales-invalid'}`}
                    />
                )}
            />
            {
                errors && touched && (
                    <FormFeedback tooltip={true} className='d-block'>
                        {errors}
                    </FormFeedback>
                )
            }
        </>
    )
}

export default MultiSelectWithoutData
