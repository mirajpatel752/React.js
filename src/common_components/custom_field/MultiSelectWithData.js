import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import { Label, Input, FormFeedback } from 'reactstrap'
function MultiSelectWithData({ option, value, name, handleChange, touched, errors, handleBlur, disabled }) {
    return (
        <>
            <Autocomplete
                multiple
                id={name}
                value={value}
                className={`munim-MUI-dropdown munim-sidebar-tags ${errors && touched ? 'is-invalid' : ''}`}
                options={option}
                disableClearable
                slotProps={{
                    popper: {
                        className: 'munim-multi-select-mui munim-sidebar-tags-option'
                    }
                }}
                onBlur={() => handleBlur(name)}
                renderOption={(props, option, { selected }) => (
                    <li {...props} className='d-flex align-items-center munim-global-user-list'>
                        <Checkbox
                            className='p-0'
                            checked={selected}
                        />
                        <p className='iedntix-cursor-pointer fw-bold munim-global-list-label'>{option.text ? option.text : option.label}</p>
                    </li>
                )}
                disabled={disabled}
                getOptionLabel={(option) => { return option.text ? option.text : option.label }}
                onChange={!disabled ? (e, value) => handleChange(name, value) : () => { }}
                renderInput={(params) => (
                    <TextField
                        {...params}
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

export default MultiSelectWithData
