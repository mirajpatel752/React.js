import React, { useState } from "react"
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Button, FormFeedback, Tooltip } from "reactstrap"
import { Box } from "@mui/material"
import { useHistory } from 'react-router-dom'
import { handleFocusTab } from "../../helper/commonFunction"

const FixSelect = ({ id, value, placeholder, options, handleChange, errors, touched, disabled, onInputChange, handleBlur, autoFocus, inputMaxlength, dynamicClassName, createNewElement, openOnFocus, handleFocus, nextFocusId, showToolTip, isLabelValue = false }) => {
    const history = useHistory()
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isShowValue, setIsShowValue] = useState(1)
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [tooltipOn, setTooltipOn] = useState('')
    const create_new_element = createNewElement ? createNewElement : ' '
    /**
    * IW0110
    * This function is called when user pressed the keyboard key
    */
    const onKeyDown = (e) => {
        setTooltipOpen(false)
        if (e.keyCode === 13) {
            // ** User Pressed ENTER
            setIsOpen(true)
        } else if (e.keyCode === 9) {
            // ** User Pressed Tab
            setIsOpen(false)
            setInputValue('')
            setIsShowValue(1)
            if (nextFocusId) {
                handleFocusTab(e, nextFocusId)
            }
        } else if (e.keyCode === 45 && options[0]?.type === 'button') {
            handleChange(id, '0')
        }
    }
    const optionHtml = (option) => {
        return <div className="d-flex justify-content-between gap-1 w-100">
            <div className="cust-flex-sec-name fw-normal">
                <div className="d-flex">
                    {
                        option.logo && <div className="channel-table-img"><img className="w-100" src={option.logo} alt="Channel logo" /> </div>
                    }
                    <span className={`cust-leger-name ${option.name === 'company' && !option.is_active ? 'inactive-danger' : ''}`}>{option.text ? option.text : option.label}</span>
                    {option.name === 'company' && !option.is_active ? <><small className='text-danger fw-bold px-1'>(Inactive)</small> </> : ''}
                </div>
            </div>
        </div>
    }
    /**
    * IW0110
    * This function is apply style on the li element option
    */
    const renderOption = (props, option) => (
        <>
            <Box component="li" {...props}>
                {option.type === 'button' ? <Button style={{ width: '100%' }}>{option.text ? option.text : option.label}</Button> : <>
                    {showToolTip ? <div id={`fix_select_${option.value}`} className="w-100">
                        {optionHtml(option)}
                        <Tooltip
                            placement='right'
                            isOpen={tooltipOpen && tooltipOn === option.value}
                            target={`fix_select_${option.value}`}
                            toggle={() => { setTooltipOpen(!tooltipOpen); setTooltipOn(option.value) }}
                        >
                            {optionHtml(option)}
                        </Tooltip>
                    </div> : <>
                        {optionHtml(option)}
                    </>}
                </>}
            </Box>
        </>
    )
    const handleInputChange = (e) => {
        setTooltipOpen(false)
        if (e?.target.value !== create_new_element) {
            if (e?.target.value && (e?.keyCode !== 13 || e?.keyCode !== 45)) {
                onInputChange(e?.target.value)
                setInputValue(e.target.value)
                setIsShowValue(1)
            } else if (e?.target.value !== undefined) {
                setIsShowValue(0)
                setInputValue('')
                onInputChange('')
            } else {
                onInputChange('')
                setIsShowValue(1)
            }
        }
    }
    let values
    if (isLabelValue) {
        values = options?.filter(ele => ele.label === value)
    } else {
        values = options?.filter(ele => ele.value === value)
    }
    return (
        <>
            <Autocomplete
                id={id}
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => { setIsOpen(false); setIsShowValue(1); setTooltipOn(''); setInputValue('') }}
                value={isShowValue ? inputValue?.length ? inputValue : values[0]?.value !== undefined ? values[0] : '' : ''}
                options={options}
                autoHighlight
                disableClearable
                disabled={disabled}
                openOnFocus={openOnFocus}
                className='munim-MUI-dropdown'
                ListboxProps={dynamicClassName ? { className: dynamicClassName } : {}}
                disablePortal
                sx={{ width: '100%' }}
                onKeyDown={onKeyDown}
                renderOption={renderOption}
                onChange={!disabled ? (_, values) => handleChange(id, values.value, values) : () => { }}
                onFocus={handleFocus}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        placeholder={disabled && history.location.pathname.includes('view') ? '-' : placeholder}
                        className={`${errors && touched && 'munim-sales-invalid'}`}
                        autoFocus={autoFocus}
                        InputProps={{
                            ...params.InputProps,
                            maxLength: inputMaxlength ? inputMaxlength : '',
                            startAdornment: (values[0]?.logo ? <img className="channel-table-img" src={values[0]?.logo} alt="logo" /> : null)
                        }}
                    />
                )}
                onBlur={handleBlur ? () => handleBlur(id) : () => { }}
                onInputChange={onInputChange ? (e) => handleInputChange(e) : () => { }}
                getOptionLabel={(option) => {
                    if (typeof option === "string") {
                        return option
                    }
                    if (option.inputValue) {
                        return option.inputValue
                    }
                    return option.text ? option.text : option.label.includes(createNewElement) ? '' : option.label
                }}
            // filterOptions={(options, params) => {
            //     const filtered = options?.filter(ele => ele.label !== params.inputValue)
            //     return filtered
            // }}
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

export default FixSelect
